import { PlayListItem } from "../../../types/interface";
import ResponseDto from "../response.dto";

export default interface GetLatestPlayListResponseDto extends ResponseDto {
    latestList: PlayListItem[];
}
