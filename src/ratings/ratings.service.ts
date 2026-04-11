import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import pgdb from "src/db";

@Injectable()
export class RatingsService {
  constructor(private readonly jwtService: JwtService) {}

  async addRating(
    creationId: string,
    isPositive: boolean,
    accessToken: string,
  ) {
    const user = await this.jwtService.verifyAsync(accessToken, {
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

  removeRating(id: string) {
    return "This action adds a new rating";
  }

  async getRate(id: string, accessToken: string) {
    let user;
    try {
      user = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      return { id: "0" };
    }

    const [rating] = await pgdb`
      SELECT is_positive FROM ratings WHERE voter_id = ${user.id}
    `;

    if (rating) {
      return {
        id: rating.id,
        is_positive: rating.is_positive,
      };
    }

    return { id: "0" }
  }
}
