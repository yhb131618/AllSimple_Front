import { PlayListItem } from "../../../types/interface";
import ResponseDto from "../response.dto";

export default interface GetTop3PlayListResponseDto extends ResponseDto {
    top3List: PlayListItem[];
}
