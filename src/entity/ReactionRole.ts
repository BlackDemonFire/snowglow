import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ReactionRole {
    @PrimaryColumn()
    roleId: string;

    @Column()
    name: string;

    @Column()
    guildId: string;
}
