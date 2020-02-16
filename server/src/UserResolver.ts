import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware
} from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import { User } from './entity/User';
import { MyContext } from './MyContext';
import { createAccessToken, createRefreshToken } from './auth';
import { isAuth } from './isAuth';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'hello';
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    return `Byeeee! Your user id is: ${payload!.userId}`;
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('user not found');
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error('incorrect password');
    }

    // login successful

    // set refresh token in cookies
    res.cookie('jid', createRefreshToken(user), {
      httpOnly: true
    });

    // return access token
    return {
      accessToken: createAccessToken(user)
    };
  }

  @Mutation(() => Boolean)
  async register(
    // explicit type syntax
    @Arg('email', () => String) email: string,
    // inferred type syntax
    @Arg('password') password: string
  ) {
    const hashedPassword = await hash(password, 12);

    try {
      await User.insert({
        email,
        password: hashedPassword
      });

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
