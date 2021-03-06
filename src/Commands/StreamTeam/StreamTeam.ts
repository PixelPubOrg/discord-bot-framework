import Command from "../../Abstractions/Command";
import { Message } from "discord.js";
import { ROLES } from "../../Services/Constants";

class StreamTeam extends Command {
    static NAME  = 'streamTeam';
    static ROLE  = ROLES.STREAM_TEAM;
    static ROLES = [
        ROLES.STAFF,
        ROLES.ADMIN,
        ROLES.STREAM_TEAM_MANAGER
    ];

    public Name(): string { 
        return StreamTeam.NAME;
    }
    public Namespace(): string { 
        return 'StreamTeam';
    }

    public constructor(channels: string[], roles: string[], users: string[], dbRequired = false) {
        super(channels, StreamTeam.ROLES, users, dbRequired);

        console.log('StreamTeam Ignoring:', roles);
    }

    private async AddDiscordRole(message: Message, id): Promise<any> {
        const guild  = message.guild;
        const member = guild.members.find((member) => member.id === id);

        if (!member.roles.has(StreamTeam.ROLE)) {
            member.addRole(StreamTeam.ROLE, `Added by ${message.author.username}`);
        }
    }

    private async RemoveDiscordRole(message: Message, id: string): Promise<any> {
        const guild  = message.guild;
        const member = guild.members.find((member) => member.id === id);

        if (member.roles.has(StreamTeam.ROLE)) {
            return member.removeRole(StreamTeam.ROLE,  `Removed by ${message.author.username}`);
        }
    }

    public async Run(message: Message): Promise<any> {
        const context = this.GetContext(message);
        const parameter = context.args[1].replace(/\D/g, '');

        switch((context.args[0] || '').toLowerCase()) {
            case 'add':
                await Promise.all([
                    this.AddAllowedUser(parameter),
                    this.AddDiscordRole(message, parameter)
                ]);

                break;
            case 'delete':
                await Promise.all([
                    this.RemoveAllowedUsers(context.args[1]),
                    this.RemoveDiscordRole(message, parameter)
                ]);

                break;
            default:
                return message.channel.send(`Invalid Argument: ${context.args[0]}`);
        }

       return message.channel.send('Records Updated');
    }
}

export default StreamTeam;