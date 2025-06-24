import { Entity } from "../../../shared/domain/entity";
import Uuid from "../../../shared/domain/value-objects/uuid.vo";

export class EventSectionId extends Uuid {}

export type EventSectionCreateCommand = {
    name: string;
    description?: string | null;
    total_spots: number;
    price: number;
}

export type EventSectionConstructor = {

}

// export class EventSection extends Entity {
//     id: EventSectionId;
//     name: string;
//     description: string;
//     is_published: boolean;
//     total_spots: number;
//     total_spots_reserved: number;
// }