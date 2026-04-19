import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import pgdb from "src/db";
import { JwtPayload } from "src/jwtPayload";
import { Rating } from "./entities/rating.entity";

@Injectable()
export class RatingsService {
  constructor(private readonly jwtService: JwtService) {}

  async addRating(
    creationId: string,
    isPositive: boolean,
    accessToken: string,
  ) {
    const user: JwtPayload = await this.jwtService.verifyAsync(accessToken, {
      secret: process.env.JWT_SECRET,
    });

    await pgdb`
      INSERT INTO ratings (voter_id, creation_id, is_positive) VALUES (
      ${user.id},
      ${creationId},
      ${isPositive}
      ) ON CONFLICT ON CONSTRAINT one_vote DO UPDATE SET is_positive = ${isPositive}, rated_at = CURRENT_TIMESTAMP;
    `;

    return { id: "0", is_positive: isPositive };
  }

  async getRate(id: string, accessToken: string) {
    let user: JwtPayload;
    try {
      user = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      return { id: "0", is_positive: "" };
    }

    const [rating]: [Rating] = await pgdb`
      SELECT is_positive FROM ratings WHERE voter_id = ${user.id} AND creation_id = ${id};
    `;

    if (rating) {
      return {
        id: rating.id,
        is_positive: rating.is_positive,
      };
    }

    return { id: "0", is_positive: "" };
  }
}
