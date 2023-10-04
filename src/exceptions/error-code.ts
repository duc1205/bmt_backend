export enum ErrorCode {
  UNDEFINED_ERROR = '1|500',
  VALIDATION_ERROR = '2|400',
  FORBIDDEN_ERROR = '3|403',

  USER_OLD_PASSWORD_NOT_CORRECT = '3|403',
  USER_PHONE_NUMBER_EXIST = '3|403',

  //Auth
  AUTH_USER_NOT_FOUND = '100|400',
  AUTH_USER_PASSWORD_INCORRECT = '101|400',
  AUTH_CLIENT_NOT_FOUND = '102|400',
  AUTH_PROVIDER_INVALID = '103|400',
  AUTH_USER_NEED_USER_PERMISSION = '105|400',

  // Phone Number
  PHONE_NUMBER_INVALID = '200|400',

  //User
  USER_NOT_FOUND = '300|400',

  //Group
  GROUP_NOT_BELONG_TO_YOUR_OWN = '400|400',
  GROUP_NOT_BELONG_TO_YOU = '401|400',
  GROUP_NOT_FOUND = '402|400',
  GROUP_CAN_NOT_DELETE = '403|400',

  //Group member
  GROUP_MEMBER_EXISTS_ALREADY = '500|400',
  GROUP_MEMBER_NOT_FOUND = '501|400',

  //Event
  EVENT_NOT_FOUND = '600|400',
  EVENT_CAN_NOT_CREATE = '601|400',
  EVENT_TIME_INVALID = '602|400',
  EVENT_MEMBER_EXISTED_ALREADY = '603|400',
  EVENT_MEMBER_CAN_NOT_JOIN_EVENT = '604|400',
  EVENT_CURRENT_COUNT_INVALID = '605|400',
  EVENT_MEMBER_NOT_FOUND = '606|400',
  EVENT_CAN_NOT_DELETE = '607|400',
  EVENT_MEMBER_CAN_NOT_REMOVE_USER = '608|400',
  EVENT_MEMBER_CAN_NOT_DELETE = '609|400',
  EVENT_NOT_BELONG_TO_YOU = '610|400',
  EVENT_MEMBER_CAN_NOT_LEAVE = '611|400',
}
