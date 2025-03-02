import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';
import { Comment } from './comment.entity';

@Controller('activity')
export class CommentsController {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  @Get(':activityId/comments')
  async getActivityComments(@Param('activityId') activityId: string) {
    const activity = await this.activityRepository.findOne({
      where: { id: parseInt(activityId, 10) },
      relations: ['comments'],
    });

    if (!activity) {
      throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
    }

    return activity.comments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  @Post(':activityId/comments')
  async addComment(
    @Param('activityId') activityId: string,
    @Body() commentData: { text: string },
  ) {
    const activity = await this.activityRepository.findOne({
      where: { id: parseInt(activityId, 10) },
    });

    if (!activity) {
      throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
    }

    const comment = this.commentRepository.create({
      text: commentData.text,
      activity,
    });

    return await this.commentRepository.save(comment);
  }
}
