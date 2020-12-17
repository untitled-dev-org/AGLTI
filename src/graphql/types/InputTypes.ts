import { Field, InputType } from 'type-graphql';
import { MinLength, IsEmail } from 'class-validator';
import { Links } from '../../entities/Profile';

@InputType()
export class AuthInput {
	@Field({ nullable: true })
	name?: string;

	@Field()
	@IsEmail()
	email!: string;

	@Field()
	@MinLength(6)
	password!: string;
}

@InputType()
export class ProfileInput {
	@Field({ nullable: true })
	name?: string;

	@Field({ nullable: true })
	bio?: string;

	@Field({ nullable: true })
	location?: string;

	@Field(() => [String])
	skills!: string[];

	@Field(() => Links, { nullable: true })
	links?: Links;
}
