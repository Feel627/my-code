import {
	Body,
	Controller,
	Get,
	Path,
	Post,
	Query,
	Route,
	SuccessResponse,
} from "tsoa";
import { IRoom, IMessage } from '@rocket.chat/core-typings';

/**
 * Problem with tuples https://github.com/lukeautry/tsoa/issues/685
 * @TODO this is a hack to be able to continue the poc
 */
type RoomWithoutMessage = Omit<IRoom, 'lastMessage'>;
type MessageCompatible = Omit<IMessage, 'blocks' | 'urls' | 'location'>;

@Route('rooms')
export class RoomsController extends Controller {
	private RoomService: any; // TODO missing way to import Service definitions

	constructor(rcDI: any) {
		super();
		this.RoomService = rcDI.Room;
	}

	@Get()
	public async getRooms(
		@Query() name?: string,
		@Query() limit?: number,
	): Promise<RoomWithoutMessage[]> {
		return this.RoomService.getAll(name, { limit });
	}

	@Get("{roomId}/messages")
	public async getRoomMessages(
		@Path() roomId: string,
		@Query() limit?: number,
	): Promise<MessageCompatible[]> {
		return this.RoomService.getMessages(roomId, { limit });
	}
}