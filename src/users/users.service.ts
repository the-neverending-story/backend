import { Injectable } from "@nestjs/common";
import pgdb from "../db";
import bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";

@Injectable()
export class UsersService {
  constructor(private jwtService: JwtService) {}

  async register(
    email: string,
    username: string,
    password: string,
    res: Response,
  ) {
    if (!email.match("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$")) {
      throw new Error("invalid email");
    }
    if (!username.match("^[a-zA-Z0-9]{8,}$")) {
      throw new Error("invalid username");
    }
    if (password.match("^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*)$")) {
      throw new Error("invalid password");
    } // if it matches, its a bad password

    const [usersWithName] = await pgdb`
      SELECT COUNT(*) FROM users WHERE username = ${username};
    `;
    if (Number(usersWithName.count)) {
      throw new Error("Username taken");
    }

    const [usersWithEmail] = await pgdb`
      SELECT COUNT(*) FROM users WHERE email = ${email};
    `;
    if (Number(usersWithEmail.count)) {
      throw new Error("Account with email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userIdAndRole] = await pgdb`
      INSERT INTO users (username, password, email, role) VALUES (${username}, ${hashedPassword}, ${email}, 'default') RETURNING id, role
    `;

    const payload = {
      username,
      id: userIdAndRole.id as string,
      role: userIdAndRole.role as string,
    };

    const token = await this.jwtService.signAsync(payload);
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return {
      username,
      role: userIdAndRole.role as string,
      id: userIdAndRole.id as string,
    };
  }

  async login(username: string, password: string, res: Response) {
    const [user] = await pgdb`
      select username, password, role, id from users where username = ${username};
    `;

    if (!user) {
      throw new Error("User not found");
    }

    const result: boolean = await bcrypt.compare(
      password,
      user.password as string,
    );

    if (!result) {
      throw new Error("Incorrect password");
    }

    const payload = {
      username: username,
      id: user.id as string,
      role: user.role as string,
    };

    const token = await this.jwtService.signAsync(payload);
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return {
      username,
      role: user.role as string,
      id: user.id as string,
    };
  }
}
