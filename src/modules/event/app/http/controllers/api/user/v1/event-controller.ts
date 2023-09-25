import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthPayloadModel } from 'src/modules/auth/domain/models/auth-payload-model';
import { Body, Controller, Get, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { normalizeResponseData } from 'src/core/helpers/utils';
import { Response } from 'express';
import { UserAuthGuard } from 'src/modules/auth/guards/user-auth-guard';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { GetGroupUsecase } from 'src/modules/group/domain/usecases/group/get-group-usecase';
import { CheckGroupMemberExistsUsecase } from 'src/modules/group/domain/usecases/group-member/check-group-member-exists-usecase';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';
import { GetUserUsecase } from 'src/modules/user/domain/usecases/get-user-usecase';
import { GetEventUsecase } from 'src/modules/event/domain/usecases/event/get-event-usecase';
import { EventModel } from 'src/modules/event/domain/model/event-model';
import { CreateEventUsecase } from 'src/modules/event/domain/usecases/event/create-event-usecase';
import { EventScope } from 'src/modules/event/enum/event-scope-enum';
import { UpdateEventUsecase } from 'src/modules/event/domain/usecases/event/update-event-usecase';
import { GetListEventUsecase } from 'src/modules/event/domain/usecases/event/get-list-event-usecase';
import { CheckMemberCanJoinEventUsecase } from 'src/modules/event/domain/usecases/event-member/check-member-can-join-event-usecase';
import { CreateEventMemberUsecase } from 'src/modules/event/domain/usecases/event-member/create-event-member-usecase';
import {
  CreateEventDto,
  EventParamsDto,
  GetEventListQueryDto,
  UpdateEventDto,
} from 'src/modules/event/app/dtos/event-dto';

@ApiTags('User \\ Event')
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
@Controller({ path: 'api/user/v1/event' })
export class EventController {
  constructor(
    private readonly getGroupUsecase: GetGroupUsecase,
    private readonly getEventUsecase: GetEventUsecase,
    private readonly getUserUsecase: GetUserUsecase,
    private readonly checkGroupMemberExistsUsecase: CheckGroupMemberExistsUsecase,
    private readonly getListEventUsecase: GetListEventUsecase,
    private readonly createEventUsecase: CreateEventUsecase,
    private readonly updateEventUsecase: UpdateEventUsecase,
    private readonly checkMemberCanJoinEventUsecase: CheckMemberCanJoinEventUsecase,
    private readonly createEventMemberUsecase: CreateEventMemberUsecase,
  ) {}

  /**
   *  Get event
   */
  @ApiResponse({ type: EventModel })
  @Get('/id/:id')
  async getGroup(@Req() req: any, @Param() params: EventParamsDto, @Res() res: Response) {
    const authPayload: AuthPayloadModel = req.user;
    const user = await this.getUserUsecase.call({ id: authPayload.authenticatableId });
    if (!user) {
      throw new LogicalException(ErrorCode.USER_NOT_FOUND, 'User not found', undefined);
    }

    const event = await this.getEventUsecase.call({ id: params.id }, user, undefined);

    res.json(normalizeResponseData(event, true));
  }

  /**
   * Create event
   */
  @ApiResponse({ type: EventModel })
  @Post()
  async createEvent(@Req() req: any, @Body() body: CreateEventDto, @Res() res: Response) {
    const authPayload: AuthPayloadModel = req.user;
    const user = await this.getUserUsecase.call({ id: authPayload.authenticatableId });
    if (!user) {
      throw new LogicalException(ErrorCode.USER_NOT_FOUND, 'User not found', undefined);
    }

    let group = undefined;
    if (body.scope == EventScope.Group) {
      if (!body.group_id) {
        throw new LogicalException(ErrorCode.GROUP_NOT_FOUND, 'Group not found.', undefined);
      }

      group = await this.getGroupUsecase.call({ id: body.group_id });
      if (!group) {
        throw new LogicalException(ErrorCode.GROUP_NOT_FOUND, 'Group not found.', undefined);
      }

      if (!(await this.checkGroupMemberExistsUsecase.call(group, user))) {
        throw new LogicalException(ErrorCode.GROUP_NOT_BELONG_TO_YOU, 'Group not belong to you.', undefined);
      }
    }

    const event = await this.createEventUsecase.call(group, {
      title: body.title,
      description: body.description,
      scope: body.scope,
      startTime: body.start_time,
      finishTime: body.finish_time,
      maxCount: body.max_count,
    });

    res.json(normalizeResponseData(event, false));
  }

  /**
   *  Update event
   */
  @ApiResponse({ type: 'boolean' })
  @Put('id/:id')
  async updateEvent(
    @Req() req: any,
    @Param() params: EventParamsDto,
    @Body() body: UpdateEventDto,
    @Res() res: Response,
  ) {
    const authPayload: AuthPayloadModel = req.user;
    const user = await this.getUserUsecase.call({ id: authPayload.authenticatableId });
    if (!user) {
      throw new LogicalException(ErrorCode.USER_NOT_FOUND, 'User not found', undefined);
    }

    const event = await this.getEventUsecase.call({ id: params.id }, user, undefined);
    if (!event) {
      throw new LogicalException(ErrorCode.EVENT_NOT_FOUND, 'Event not found.', undefined);
    }

    await this.updateEventUsecase.call(event, { title: body.title, description: body.description });

    res.json(normalizeResponseData(true, false));
  }

  /**
   * Get list of event
   */
  @ApiResponse({ type: [EventModel] })
  @Get()
  async list(@Req() req: any, @Query() query: GetEventListQueryDto, @Res() res: Response) {
    const authPayload: AuthPayloadModel = req.user;
    const user = await this.getUserUsecase.call({ id: authPayload.authenticatableId });
    if (!user) {
      throw new LogicalException(ErrorCode.USER_NOT_FOUND, 'User not found', undefined);
    }

    let group = undefined;
    if (query.group_id) {
      group = await this.getGroupUsecase.call({ id: query.group_id });
      if (group && !(await this.checkGroupMemberExistsUsecase.call(group, user))) {
        throw new LogicalException(ErrorCode.GROUP_NOT_BELONG_TO_YOU, 'Group not belong to you.', undefined);
      }
    }

    const pageList = await this.getListEventUsecase.call(
      new PaginationParams(query.page, query.limit, query.need_total_count, query.only_count),
      new SortParams(query.sort, query.dir),
      user,
      group,
      query.status,
      query.scope,
      undefined,
    );

    if (pageList.totalCount !== undefined) {
      res.setHeader('X-Total-Count', pageList.totalCount);
    }
    res.json(normalizeResponseData(pageList));
  }

  /**
   * Check user can join event
   */
  @Post('/id/:id/check/join')
  async checkUserAvailableJoin(@Req() req: any, @Param() params: EventParamsDto, @Res() res: Response) {
    const authPayload: AuthPayloadModel = req.user;
    const user = await this.getUserUsecase.call({ id: authPayload.authenticatableId });
    if (!user) {
      throw new LogicalException(ErrorCode.USER_NOT_FOUND, 'User not found', undefined);
    }

    const event = await this.getEventUsecase.call({ id: params.id }, user, undefined);
    if (!event) {
      throw new LogicalException(ErrorCode.EVENT_NOT_FOUND, 'Event not found.', undefined);
    }

    res.json(normalizeResponseData(await this.checkMemberCanJoinEventUsecase.call(event, user)));
  }

  /**
   * Join event
   */
  @Post('/id/:id/join')
  async joinEvent(@Req() req: any, @Param() params: EventParamsDto, @Res() res: Response) {
    const authPayload: AuthPayloadModel = req.user;
    const user = await this.getUserUsecase.call({ id: authPayload.authenticatableId });
    if (!user) {
      throw new LogicalException(ErrorCode.USER_NOT_FOUND, 'User not found', undefined);
    }

    const event = await this.getEventUsecase.call({ id: params.id }, user, undefined);
    if (!event) {
      throw new LogicalException(ErrorCode.EVENT_NOT_FOUND, 'Event not found.', undefined);
    }

    res.json(normalizeResponseData(await this.createEventMemberUsecase.call(event, user)));
  }
}
