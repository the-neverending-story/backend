import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import pgdb from "src/db";

@Injectable()
export class CreationsService {
  constructor(private readonly jwtService: JwtService) {}

  async create(name: string, category: string, content: string, req: Request) {
    const user = await this.jwtService.verifyAsync(
      req.cookies["access_token"],
      { secret: process.env.JWT_SECRET },
    );

    const [id] = await pgdb`
      INSERT INTO creations (name, category, content, author_id) VALUES (${name}, ${category}, ${content}, ${user.id}) RETURNING id;
    `;

    return { id: id.id as string };
  }
}
