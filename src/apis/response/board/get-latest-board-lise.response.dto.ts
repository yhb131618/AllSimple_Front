import ResponseDto from "../response.dto";
import {BoardListItem} from "../../../types/interface";

export default interface GetLatestBoardLiseResponseDto extends ResponseDto {
    latestList: BoardListItem[];
}
