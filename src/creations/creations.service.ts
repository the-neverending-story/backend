import { Injectable } from "@nestjs/common";
import { JwtPayload } from "../auth/jwt.strategy";
import pgdb from "src/db";

@Injectable()
export class CreationsService {
  async create(
    name: string,
    category: string,
    content: string,
    user: JwtPayload,
  ) {
    const [id] = await pgdb`
      INSERT INTO creations (name, category, content, author_id) VALUES (${name}, ${category}, ${content}, ${user.id}) RETURNING id;
    `;

    return { id: id.id as string };
  }

  async getPageOfCreations(
    page: number,
    category: string,
    author: string,
    name: string,
    in_voting_phase: boolean,
  ) {
    const creations = await pgdb`
      SELECT
        username author_username,
        name,
        creations.id,
        creations.created_at,
        category,
        (SELECT COALESCE(SUM(CASE WHEN is_positive = true THEN 1 WHEN is_positive = false THEN -1 END), 0) FROM ratings WHERE ratings.creation_id = creations.id) AS rating
      FROM creations JOIN users ON users.id = creations.author_id 
      WHERE true 
      ${category && category !== "none" ? pgdb`AND category = ${category}` : pgdb``}
      ${author ? pgdb`AND username = ${author}` : pgdb``}
      ${name ? pgdb`AND name = ${name}` : pgdb``}
      ${in_voting_phase ? pgdb`AND creations.created_at > NOW() - INTERVAL '1 week'` : pgdb``}
      LIMIT 15 OFFSET ${(page - 1) * 15};
    `;

    return creations.map((e) => {
      return { ...e, created_at: new Date(e.created_at).toDateString() };
    });
  }

  async getCreationById(id: string) {
    const [creation] = await pgdb`
      SELECT
        username author_username,
        name,
        creations.id,
        creations.created_at,
        category,
        content,
        (SELECT COALESCE(SUM(CASE WHEN is_positive = true THEN 1 WHEN is_positive = false THEN -1 END), 0) FROM ratings WHERE ratings.creation_id = creations.id) AS rating
      FROM creations JOIN users ON users.id = creations.author_id WHERE creations.id = ${id};
    `;

    return {
      ...creation,
      created_at: new Date(creation.created_at).toDateString(),
    };
  }
}
