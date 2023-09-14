import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthPayloadModel } from 'src/modules/auth/domain/models/auth-payload-model';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { normalizeResponseData, throwError } from 'src/core/helpers/utils';
import { Response } from 'express';
import { UserAuthGuard } from 'src/modules/auth/guards/user-auth-guard';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { GetGroupUsecase } from 'src/modules/group/domain/usecases/group/get-group-usecase';
import { CheckGroupMemberExistsUsecase } from 'src/modules/group/domain/usecases/group-member/check-group-member-exists-usecase';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';
import { GroupMemberModel } from 'src/modules/group/domain/models/group-member-model';
import { GetUserUsecase } from 'src/modules/user/domain/usecases/get-user-usecase';
import { AddGroupMemberUsecase } from 'src/modules/group/domain/usecases/group-member/add-group-member-usecase';
import { ListGroupMembersUsecase } from 'src/modules/group/domain/usecases/group-member/list-group-members-usecase';
import { RemoveGroupMemberUsecase } from 'src/modules/group/domain/usecases/group-member/remove-group-member-usecase';
import {
  AddGroupMemberDto,
  GetGroupMemberListQueryDto,
  GroupMemberParamsDto,
  RemoveGroupMemberDto,
} from 'src/modules/group/app/dtos/group-member-dto';
import { GetCountGroupMembersUsecase } from 'src/modules/group/domain/usecases/group-member/get-count-group-member-usecase';

@ApiTags('User \\ Group Member')
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
@Controller({ path: 'api/user/v1/group/member' })
export class GroupMemberController {
  constructor(
    private readonly getUserUsecase: GetUserUsecase,
    private readonly getGroupUsecase: GetGroupUsecase,
    private readonly checkGroupMemberExistsUsecase: CheckGroupMemberExistsUsecase,
    private readonly addGroupMemberUsecase: AddGroupMemberUsecase,
    private readonly listGroupMembersUsecase: ListGroupMembersUsecase,
    private readonly removeGroupMemberUsecase: RemoveGroupMemberUsecase,
    private readonly getCountGroupMembersUsecase: GetCountGroupMembersUsecase,
  ) {}

  /**
   * Add group member
   */
  @ApiResponse({ type: GroupMemberModel })
  @Post()
  async addMember(@Req() req: any, @Body() body: AddGroupMemberDto, @Res() res: Response) {
    const authPayload: AuthPayloadModel = req.user;
    const user = (await this.getUserUsecase.call({ id: authPayload.authenticatableId })) ?? throwError();

    const group = await this.getGroupUsecase.call({ id: body.group_id });
    if (!group) {
      throw new LogicalException(ErrorCode.GROUP_NOT_FOUND, 'Group not found.', undefined);
    }

    const member = await this.getUserUsecase.call({ id: body.member_id });
    if (!member) {
      throw new LogicalException(ErrorCode.USER_NOT_FOUND, 'Member not found.', undefined);
    }

    const groupMember = await this.addGroupMemberUsecase.call(group, user, member);

    res.json(normalizeResponseData(groupMember, false));
  }

  /**
   *  Remove group member
   */
  @ApiResponse({ status: HttpStatus.OK, schema: { type: 'boolean' } })
  @Delete()
  async delete(@Req() req: any, @Body() body: RemoveGroupMemberDto, @Res() res: Response) {
    const authPayload: AuthPayloadModel = req.user;
    const user = (await this.getUserUsecase.call({ id: authPayload.authenticatableId })) ?? throwError();

    const group = await this.getGroupUsecase.call({ id: body.group_id });
    if (!group) {
      throw new LogicalException(ErrorCode.GROUP_NOT_FOUND, 'Group not found.', undefined);
    }

    if (!(await this.checkGroupMemberExistsUsecase.call(group, user))) {
      throw new LogicalException(ErrorCode.GROUP_NOT_BELONG_TO_YOU, 'Group not belong to you.', undefined);
    }

    const member = await this.getUserUsecase.call({ id: body.member_id });
    if (!member) {
      throw new LogicalException(ErrorCode.USER_NOT_FOUND, 'Member not found.', undefined);
    }

    await this.removeGroupMemberUsecase.call(group, user, member);

    res.status(HttpStatus.OK).json(normalizeResponseData(true));
  }

  /**
   * Get list of group member
   */
  @ApiResponse({ type: [UserModel] })
  @Get()
  async list(@Req() req: any, @Query() query: GetGroupMemberListQueryDto, @Res() res: Response) {
    const authPayload: AuthPayloadModel = req.user;
    const user = (await this.getUserUsecase.call({ id: authPayload.authenticatableId })) ?? throwError();

    const group = await this.getGroupUsecase.call({ id: query.group_id });
    if (!group) {
      throw new LogicalException(ErrorCode.GROUP_NOT_FOUND, 'Group not found.', undefined);
    }

    if (!(await this.checkGroupMemberExistsUsecase.call(group, user))) {
      throw new LogicalException(ErrorCode.GROUP_NOT_BELONG_TO_YOU, 'Group not belong to you.', undefined);
    }

    const pageList = await this.listGroupMembersUsecase.call(
      new PaginationParams(query.page, query.limit, query.need_total_count, query.only_count),
      new SortParams(query.sort, query.dir),
      group,
      undefined,
    );

    if (pageList.totalCount !== undefined) {
      res.setHeader('X-Total-Count', pageList.totalCount);
    }

    res.json(normalizeResponseData(pageList));
  }

  /**
   * Count group member
   */
  @ApiResponse({ type: 'number' })
  @Get('/group/id/:group_id/count')
  async count(@Req() req: any, @Param() params: GroupMemberParamsDto, @Res() res: Response) {
    const authPayload: AuthPayloadModel = req.user;
    const user = (await this.getUserUsecase.call({ id: authPayload.authenticatableId })) ?? throwError();

    const group = await this.getGroupUsecase.call({ id: params.group_id });
    if (!group) {
      throw new LogicalException(ErrorCode.GROUP_NOT_FOUND, 'Group not found.', undefined);
    }

    if (!(await this.checkGroupMemberExistsUsecase.call(group, user))) {
      throw new LogicalException(ErrorCode.GROUP_NOT_BELONG_TO_YOU, 'Group not belong to you.', undefined);
    }

    res.json(normalizeResponseData(await this.getCountGroupMembersUsecase.call(group)));
  }
}
