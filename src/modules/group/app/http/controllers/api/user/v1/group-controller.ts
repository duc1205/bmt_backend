import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthPayloadModel } from 'src/modules/auth/domain/models/auth-payload-model';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { normalizeResponseData, throwError } from 'src/core/helpers/utils';
import { Response } from 'express';
import { UserAuthGuard } from 'src/modules/auth/guards/user-auth-guard';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { GetGroupUsecase } from 'src/modules/group/domain/usecases/group/get-group-usecase';
import { CheckGroupMemberExistsUsecase } from 'src/modules/group/domain/usecases/group-member/check-group-member-exists-usecase';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';
import { UpdateGroupUsecase } from 'src/modules/group/domain/usecases/group/update-group-usecase';
import { GetUserUsecase } from 'src/modules/user/domain/usecases/get-user-usecase';
import { DeleteGroupUsecase } from 'src/modules/group/domain/usecases/group/delete-group-usecase';
import { ListGroupsUsecase } from 'src/modules/group/domain/usecases/group/list-groups-usecase';
import { CreateGroupUsecase } from 'src/modules/group/domain/usecases/group/create-group-usecase';
import {
  CreateGroupDto,
  GetGroupListQueryDto,
  GroupParamsDto,
  UpdateGroupDto,
} from 'src/modules/group/app/dtos/group-dto';

@ApiTags('User \\ Group')
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
@Controller({ path: 'api/user/v1/group' })
export class GroupController {
  constructor(
    private readonly getGroupUsecase: GetGroupUsecase,
    private readonly getUserUsecase: GetUserUsecase,
    private readonly checkGroupMemberExistsUsecase: CheckGroupMemberExistsUsecase,
    private readonly updateGroupUsecase: UpdateGroupUsecase,
    private readonly deleteGroupUsecase: DeleteGroupUsecase,
    private readonly listGroupsUsecase: ListGroupsUsecase,
    private readonly createGroupUsecase: CreateGroupUsecase,
  ) {}

  /**
   *  Get group
   */
  @ApiResponse({ type: GroupModel })
  @Get('/id/:id')
  async getGroup(@Req() req: any, @Param() params: GroupParamsDto, @Res() res: Response) {
    const authPayload: AuthPayloadModel = req.user;
    const user = (await this.getUserUsecase.call({ id: authPayload.authenticatableId })) ?? throwError();

    const group = await this.getGroupUsecase.call({ id: params.id });
    if (group && !(await this.checkGroupMemberExistsUsecase.call(group, user))) {
      throw new LogicalException(ErrorCode.GROUP_NOT_BELONG_TO_YOU, 'Group not belong to you.', undefined);
    }

    res.json(normalizeResponseData(group, true));
  }

  /**
   * Create group
   */
  @ApiResponse({ type: GroupModel })
  @Post()
  async createGroup(@Req() req: any, @Body() body: CreateGroupDto, @Res() res: Response) {
    const authPayload: AuthPayloadModel = req.user;
    const user = (await this.getUserUsecase.call({ id: authPayload.authenticatableId })) ?? throwError();

    const group = await this.createGroupUsecase.call(user, { name: body.name, avatarPath: body.avatar_path });

    res.json(normalizeResponseData(group, false));
  }

  /**
   *  Update group
   */
  @ApiResponse({ type: UserModel })
  @Put('id/:id')
  async updateGroup(
    @Req() req: any,
    @Param() params: GroupParamsDto,
    @Body() body: UpdateGroupDto,
    @Res() res: Response,
  ) {
    const authPayload: AuthPayloadModel = req.user;
    const user = (await this.getUserUsecase.call({ id: authPayload.authenticatableId })) ?? throwError();

    const group = await this.getGroupUsecase.call({ id: params.id });
    if (!group) {
      throw new LogicalException(ErrorCode.GROUP_NOT_FOUND, 'Group not found.', undefined);
    }

    if (!(await this.checkGroupMemberExistsUsecase.call(group, user))) {
      throw new LogicalException(ErrorCode.GROUP_NOT_BELONG_TO_YOU, 'Group not belong to you.', undefined);
    }

    const updateGroup = await this.updateGroupUsecase.call(group, { name: body.name, avatarPath: body.avatar_path });

    res.json(normalizeResponseData(updateGroup, false));
  }

  /**
   *  Delete group
   */
  @ApiResponse({ status: HttpStatus.OK, schema: { type: 'boolean' } })
  @Delete('/id/:id')
  async delete(@Req() req: any, @Param() params: GroupParamsDto, @Res() res: Response) {
    const authPayload: AuthPayloadModel = req.user;
    const user = (await this.getUserUsecase.call({ id: authPayload.authenticatableId })) ?? throwError();

    const group = await this.getGroupUsecase.call({ id: params.id });
    if (!group) {
      throw new LogicalException(ErrorCode.GROUP_NOT_FOUND, 'Group not found.', undefined);
    }

    if (!(await this.checkGroupMemberExistsUsecase.call(group, user))) {
      throw new LogicalException(ErrorCode.GROUP_NOT_BELONG_TO_YOU, 'Group not belong to you.', undefined);
    }

    await this.deleteGroupUsecase.call(group, user);

    res.status(HttpStatus.OK).json(normalizeResponseData(true));
  }

  /**
   * Get list of group
   */
  @ApiResponse({ type: [GroupModel] })
  @Get()
  async list(@Req() req: any, @Query() query: GetGroupListQueryDto, @Res() res: Response) {
    const authPayload: AuthPayloadModel = req.user;
    const user = (await this.getUserUsecase.call({ id: authPayload.authenticatableId })) ?? throwError();

    const pageList = await this.listGroupsUsecase.call(
      new PaginationParams(query.page, query.limit, query.need_total_count, query.only_count),
      new SortParams(query.sort, query.dir),
      user,
      ['owner'],
    );

    if (pageList.totalCount !== undefined) {
      res.setHeader('X-Total-Count', pageList.totalCount);
    }
    res.json(normalizeResponseData(pageList));
  }
}
