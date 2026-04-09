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

  async getPageOfCreations(page: number) {
    const creations = await pgdb`
      SELECT
        username author_username,
        name,
        creations.id,
        creations.created_at,
        category,
        (SELECT COALESCE(SUM(CASE WHEN is_positive = true THEN 1 WHEN is_positive = false THEN -1 END), 0) FROM ratings WHERE ratings.creation_id = creations.id) AS rating
      FROM creations JOIN users ON users.id = creations.author_id LIMIT 15 OFFSET ${(page - 1) * 15};
    `;

    return creations.map((e) => {
      return { ...e, created_at: new Date(e.created_at).toDateString() };
    });
  }
}
