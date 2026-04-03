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
    const [usersWithName] = await pgdb`
      SELECT COUNT(*) FROM users WHERE username = ${username};
    `;

    if (Number(usersWithName.count)) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userId] = await pgdb`
      INSERT INTO users (username, password, email, role) VALUES (${username}, ${hashedPassword}, ${email}, '1') RETURNING id
    `;

    const payload = {
      username: username,
      id: userId.id as string,
    };
    const token = await this.jwtService.signAsync(payload);
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 3600000,
    });

    return {
      username: "asdfca123",
    };
  }

  async login(username: string, password: string, res: Response) {
    const [user] = await pgdb`
      select username, password from users where username = ${username};
    `;

    if (!user) {
      throw new Error("User not found");
    }

    const result: boolean = await bcrypt.compare(
      password,
      user.password as string,
    );

    if (result) {
      const payload = {
        username: username,
        id: user.id as string,
      };
      const token = await this.jwtService.signAsync(payload);
      res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 3600000,
      });

      return {
        username: "asdfca123",
      };
    } else {
      throw new Error("Incorrect password");
    }
  }
}
