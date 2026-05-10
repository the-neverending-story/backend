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
    relations: string[],
  ) {
    const [id] = await pgdb`
      INSERT INTO creations (name, category, content, author_id) VALUES (${name}, ${category}, ${content}, ${user.id}) RETURNING id;
    `;
    if (relations) {
      await pgdb`
      INSERT INTO relations (creation_id, related_to_id) VALUES
      ${relations.map((relation_id, index) => {
        return pgdb`(${id.id}, ${relation_id})${index !== relations.length - 1 ? pgdb`,` : pgdb``}`;
      })}
    `;
    }

    return { id: id.id as string };
  }

  async getPageOfCreations(
    page: number,
    category: string | undefined,
    author: string | undefined,
    name: string | undefined,
    in_voting_phase: boolean | undefined,
    is_canon: boolean | undefined
  ) {
    if (page === undefined) {
      throw new Error("page is required");
    }
    if (name !== undefined) {
      name = name.replaceAll("%", "");
    }

    const creations = await pgdb`
      SELECT
        username author_username,
        name,
        creations.id,
        creations.created_at,
        category,
        is_canon,
        (SELECT COALESCE(SUM(CASE WHEN is_positive = true THEN 1 WHEN is_positive = false THEN -1 END), 0) FROM ratings WHERE ratings.creation_id = creations.id) AS rating
      FROM creations JOIN users ON users.id = creations.author_id 
      WHERE true 
      ${category ? pgdb`AND category = ${category}` : pgdb``}
      ${author ? pgdb`AND username = ${author}` : pgdb``}
      ${name ? pgdb`AND name ILIKE ${`%${name}%`}` : pgdb``}
      ${in_voting_phase ? pgdb`AND creations.created_at > NOW() - INTERVAL '1 week'` : pgdb``}
      ${is_canon !== undefined ? pgdb`AND is_canon = ${is_canon}` : pgdb``}
      LIMIT 15 OFFSET ${(page - 1) * 15};
    `;

    return creations.map(async (e) => {
      const relations = await pgdb`
        SELECT related_to_id FROM relations WHERE relations.creation_id = ${e.id};
      `;

      return {
        ...e,
        relations: relations.map((e) => e.related_to_id),
      };
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

    return creation;
  }

  async getFeaturedCreations() {
    const creations = await pgdb`
      SELECT * FROM creations ORDER BY (SELECT COALESCE(SUM(CASE WHEN is_positive = true THEN 1 WHEN is_positive = false THEN -1 END), 0) FROM ratings WHERE creation_id = creations.id) DESC LIMIT 10;
    `
    return creations
  }
}
