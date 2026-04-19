
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model ZaloGroup
 * 
 */
export type ZaloGroup = $Result.DefaultSelection<Prisma.$ZaloGroupPayload>
/**
 * Model ZaloAccountRelation
 * 
 */
export type ZaloAccountRelation = $Result.DefaultSelection<Prisma.$ZaloAccountRelationPayload>
/**
 * Model ZaloAccount
 * 
 */
export type ZaloAccount = $Result.DefaultSelection<Prisma.$ZaloAccountPayload>
/**
 * Model ZaloAccountGroup
 * 
 */
export type ZaloAccountGroup = $Result.DefaultSelection<Prisma.$ZaloAccountGroupPayload>
/**
 * Model ZaloAccountFriend
 * 
 */
export type ZaloAccountFriend = $Result.DefaultSelection<Prisma.$ZaloAccountFriendPayload>
/**
 * Model Message
 * 
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>
/**
 * Model ApiKey
 * 
 */
export type ApiKey = $Result.DefaultSelection<Prisma.$ApiKeyPayload>
/**
 * Model Configuration
 * 
 */
export type Configuration = $Result.DefaultSelection<Prisma.$ConfigurationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const MessageStatus: {
  SENT: 'SENT',
  FAILED: 'FAILED',
  RECALL: 'RECALL'
};

export type MessageStatus = (typeof MessageStatus)[keyof typeof MessageStatus]


export const ZaloAccountFriendStatus: {
  PENDING: 'PENDING',
  APPROVE: 'APPROVE',
  CANCEL: 'CANCEL'
};

export type ZaloAccountFriendStatus = (typeof ZaloAccountFriendStatus)[keyof typeof ZaloAccountFriendStatus]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type MessageStatus = $Enums.MessageStatus

export const MessageStatus: typeof $Enums.MessageStatus

export type ZaloAccountFriendStatus = $Enums.ZaloAccountFriendStatus

export const ZaloAccountFriendStatus: typeof $Enums.ZaloAccountFriendStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.zaloGroup`: Exposes CRUD operations for the **ZaloGroup** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ZaloGroups
    * const zaloGroups = await prisma.zaloGroup.findMany()
    * ```
    */
  get zaloGroup(): Prisma.ZaloGroupDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.zaloAccountRelation`: Exposes CRUD operations for the **ZaloAccountRelation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ZaloAccountRelations
    * const zaloAccountRelations = await prisma.zaloAccountRelation.findMany()
    * ```
    */
  get zaloAccountRelation(): Prisma.ZaloAccountRelationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.zaloAccount`: Exposes CRUD operations for the **ZaloAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ZaloAccounts
    * const zaloAccounts = await prisma.zaloAccount.findMany()
    * ```
    */
  get zaloAccount(): Prisma.ZaloAccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.zaloAccountGroup`: Exposes CRUD operations for the **ZaloAccountGroup** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ZaloAccountGroups
    * const zaloAccountGroups = await prisma.zaloAccountGroup.findMany()
    * ```
    */
  get zaloAccountGroup(): Prisma.ZaloAccountGroupDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.zaloAccountFriend`: Exposes CRUD operations for the **ZaloAccountFriend** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ZaloAccountFriends
    * const zaloAccountFriends = await prisma.zaloAccountFriend.findMany()
    * ```
    */
  get zaloAccountFriend(): Prisma.ZaloAccountFriendDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.MessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.apiKey`: Exposes CRUD operations for the **ApiKey** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ApiKeys
    * const apiKeys = await prisma.apiKey.findMany()
    * ```
    */
  get apiKey(): Prisma.ApiKeyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.configuration`: Exposes CRUD operations for the **Configuration** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Configurations
    * const configurations = await prisma.configuration.findMany()
    * ```
    */
  get configuration(): Prisma.ConfigurationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.7.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    ZaloGroup: 'ZaloGroup',
    ZaloAccountRelation: 'ZaloAccountRelation',
    ZaloAccount: 'ZaloAccount',
    ZaloAccountGroup: 'ZaloAccountGroup',
    ZaloAccountFriend: 'ZaloAccountFriend',
    Message: 'Message',
    ApiKey: 'ApiKey',
    Configuration: 'Configuration'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "zaloGroup" | "zaloAccountRelation" | "zaloAccount" | "zaloAccountGroup" | "zaloAccountFriend" | "message" | "apiKey" | "configuration"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      ZaloGroup: {
        payload: Prisma.$ZaloGroupPayload<ExtArgs>
        fields: Prisma.ZaloGroupFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ZaloGroupFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloGroupPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ZaloGroupFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloGroupPayload>
          }
          findFirst: {
            args: Prisma.ZaloGroupFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloGroupPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ZaloGroupFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloGroupPayload>
          }
          findMany: {
            args: Prisma.ZaloGroupFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloGroupPayload>[]
          }
          create: {
            args: Prisma.ZaloGroupCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloGroupPayload>
          }
          createMany: {
            args: Prisma.ZaloGroupCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ZaloGroupCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloGroupPayload>[]
          }
          delete: {
            args: Prisma.ZaloGroupDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloGroupPayload>
          }
          update: {
            args: Prisma.ZaloGroupUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloGroupPayload>
          }
          deleteMany: {
            args: Prisma.ZaloGroupDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ZaloGroupUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ZaloGroupUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloGroupPayload>[]
          }
          upsert: {
            args: Prisma.ZaloGroupUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloGroupPayload>
          }
          aggregate: {
            args: Prisma.ZaloGroupAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateZaloGroup>
          }
          groupBy: {
            args: Prisma.ZaloGroupGroupByArgs<ExtArgs>
            result: $Utils.Optional<ZaloGroupGroupByOutputType>[]
          }
          count: {
            args: Prisma.ZaloGroupCountArgs<ExtArgs>
            result: $Utils.Optional<ZaloGroupCountAggregateOutputType> | number
          }
        }
      }
      ZaloAccountRelation: {
        payload: Prisma.$ZaloAccountRelationPayload<ExtArgs>
        fields: Prisma.ZaloAccountRelationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ZaloAccountRelationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountRelationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ZaloAccountRelationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountRelationPayload>
          }
          findFirst: {
            args: Prisma.ZaloAccountRelationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountRelationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ZaloAccountRelationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountRelationPayload>
          }
          findMany: {
            args: Prisma.ZaloAccountRelationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountRelationPayload>[]
          }
          create: {
            args: Prisma.ZaloAccountRelationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountRelationPayload>
          }
          createMany: {
            args: Prisma.ZaloAccountRelationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ZaloAccountRelationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountRelationPayload>[]
          }
          delete: {
            args: Prisma.ZaloAccountRelationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountRelationPayload>
          }
          update: {
            args: Prisma.ZaloAccountRelationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountRelationPayload>
          }
          deleteMany: {
            args: Prisma.ZaloAccountRelationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ZaloAccountRelationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ZaloAccountRelationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountRelationPayload>[]
          }
          upsert: {
            args: Prisma.ZaloAccountRelationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountRelationPayload>
          }
          aggregate: {
            args: Prisma.ZaloAccountRelationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateZaloAccountRelation>
          }
          groupBy: {
            args: Prisma.ZaloAccountRelationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ZaloAccountRelationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ZaloAccountRelationCountArgs<ExtArgs>
            result: $Utils.Optional<ZaloAccountRelationCountAggregateOutputType> | number
          }
        }
      }
      ZaloAccount: {
        payload: Prisma.$ZaloAccountPayload<ExtArgs>
        fields: Prisma.ZaloAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ZaloAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ZaloAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountPayload>
          }
          findFirst: {
            args: Prisma.ZaloAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ZaloAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountPayload>
          }
          findMany: {
            args: Prisma.ZaloAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountPayload>[]
          }
          create: {
            args: Prisma.ZaloAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountPayload>
          }
          createMany: {
            args: Prisma.ZaloAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ZaloAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountPayload>[]
          }
          delete: {
            args: Prisma.ZaloAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountPayload>
          }
          update: {
            args: Prisma.ZaloAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountPayload>
          }
          deleteMany: {
            args: Prisma.ZaloAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ZaloAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ZaloAccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountPayload>[]
          }
          upsert: {
            args: Prisma.ZaloAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountPayload>
          }
          aggregate: {
            args: Prisma.ZaloAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateZaloAccount>
          }
          groupBy: {
            args: Prisma.ZaloAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<ZaloAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.ZaloAccountCountArgs<ExtArgs>
            result: $Utils.Optional<ZaloAccountCountAggregateOutputType> | number
          }
        }
      }
      ZaloAccountGroup: {
        payload: Prisma.$ZaloAccountGroupPayload<ExtArgs>
        fields: Prisma.ZaloAccountGroupFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ZaloAccountGroupFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountGroupPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ZaloAccountGroupFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountGroupPayload>
          }
          findFirst: {
            args: Prisma.ZaloAccountGroupFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountGroupPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ZaloAccountGroupFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountGroupPayload>
          }
          findMany: {
            args: Prisma.ZaloAccountGroupFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountGroupPayload>[]
          }
          create: {
            args: Prisma.ZaloAccountGroupCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountGroupPayload>
          }
          createMany: {
            args: Prisma.ZaloAccountGroupCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ZaloAccountGroupCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountGroupPayload>[]
          }
          delete: {
            args: Prisma.ZaloAccountGroupDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountGroupPayload>
          }
          update: {
            args: Prisma.ZaloAccountGroupUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountGroupPayload>
          }
          deleteMany: {
            args: Prisma.ZaloAccountGroupDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ZaloAccountGroupUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ZaloAccountGroupUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountGroupPayload>[]
          }
          upsert: {
            args: Prisma.ZaloAccountGroupUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountGroupPayload>
          }
          aggregate: {
            args: Prisma.ZaloAccountGroupAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateZaloAccountGroup>
          }
          groupBy: {
            args: Prisma.ZaloAccountGroupGroupByArgs<ExtArgs>
            result: $Utils.Optional<ZaloAccountGroupGroupByOutputType>[]
          }
          count: {
            args: Prisma.ZaloAccountGroupCountArgs<ExtArgs>
            result: $Utils.Optional<ZaloAccountGroupCountAggregateOutputType> | number
          }
        }
      }
      ZaloAccountFriend: {
        payload: Prisma.$ZaloAccountFriendPayload<ExtArgs>
        fields: Prisma.ZaloAccountFriendFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ZaloAccountFriendFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountFriendPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ZaloAccountFriendFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountFriendPayload>
          }
          findFirst: {
            args: Prisma.ZaloAccountFriendFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountFriendPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ZaloAccountFriendFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountFriendPayload>
          }
          findMany: {
            args: Prisma.ZaloAccountFriendFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountFriendPayload>[]
          }
          create: {
            args: Prisma.ZaloAccountFriendCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountFriendPayload>
          }
          createMany: {
            args: Prisma.ZaloAccountFriendCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ZaloAccountFriendCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountFriendPayload>[]
          }
          delete: {
            args: Prisma.ZaloAccountFriendDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountFriendPayload>
          }
          update: {
            args: Prisma.ZaloAccountFriendUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountFriendPayload>
          }
          deleteMany: {
            args: Prisma.ZaloAccountFriendDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ZaloAccountFriendUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ZaloAccountFriendUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountFriendPayload>[]
          }
          upsert: {
            args: Prisma.ZaloAccountFriendUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZaloAccountFriendPayload>
          }
          aggregate: {
            args: Prisma.ZaloAccountFriendAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateZaloAccountFriend>
          }
          groupBy: {
            args: Prisma.ZaloAccountFriendGroupByArgs<ExtArgs>
            result: $Utils.Optional<ZaloAccountFriendGroupByOutputType>[]
          }
          count: {
            args: Prisma.ZaloAccountFriendCountArgs<ExtArgs>
            result: $Utils.Optional<ZaloAccountFriendCountAggregateOutputType> | number
          }
        }
      }
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>
        fields: Prisma.MessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessage>
          }
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>
            result: $Utils.Optional<MessageCountAggregateOutputType> | number
          }
        }
      }
      ApiKey: {
        payload: Prisma.$ApiKeyPayload<ExtArgs>
        fields: Prisma.ApiKeyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApiKeyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApiKeyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          findFirst: {
            args: Prisma.ApiKeyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApiKeyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          findMany: {
            args: Prisma.ApiKeyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[]
          }
          create: {
            args: Prisma.ApiKeyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          createMany: {
            args: Prisma.ApiKeyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ApiKeyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[]
          }
          delete: {
            args: Prisma.ApiKeyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          update: {
            args: Prisma.ApiKeyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          deleteMany: {
            args: Prisma.ApiKeyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApiKeyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ApiKeyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[]
          }
          upsert: {
            args: Prisma.ApiKeyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          aggregate: {
            args: Prisma.ApiKeyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApiKey>
          }
          groupBy: {
            args: Prisma.ApiKeyGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApiKeyGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApiKeyCountArgs<ExtArgs>
            result: $Utils.Optional<ApiKeyCountAggregateOutputType> | number
          }
        }
      }
      Configuration: {
        payload: Prisma.$ConfigurationPayload<ExtArgs>
        fields: Prisma.ConfigurationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConfigurationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigurationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConfigurationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigurationPayload>
          }
          findFirst: {
            args: Prisma.ConfigurationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigurationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConfigurationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigurationPayload>
          }
          findMany: {
            args: Prisma.ConfigurationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigurationPayload>[]
          }
          create: {
            args: Prisma.ConfigurationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigurationPayload>
          }
          createMany: {
            args: Prisma.ConfigurationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConfigurationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigurationPayload>[]
          }
          delete: {
            args: Prisma.ConfigurationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigurationPayload>
          }
          update: {
            args: Prisma.ConfigurationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigurationPayload>
          }
          deleteMany: {
            args: Prisma.ConfigurationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConfigurationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConfigurationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigurationPayload>[]
          }
          upsert: {
            args: Prisma.ConfigurationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigurationPayload>
          }
          aggregate: {
            args: Prisma.ConfigurationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConfiguration>
          }
          groupBy: {
            args: Prisma.ConfigurationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConfigurationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConfigurationCountArgs<ExtArgs>
            result: $Utils.Optional<ConfigurationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    zaloGroup?: ZaloGroupOmit
    zaloAccountRelation?: ZaloAccountRelationOmit
    zaloAccount?: ZaloAccountOmit
    zaloAccountGroup?: ZaloAccountGroupOmit
    zaloAccountFriend?: ZaloAccountFriendOmit
    message?: MessageOmit
    apiKey?: ApiKeyOmit
    configuration?: ConfigurationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ZaloGroupCountOutputType
   */

  export type ZaloGroupCountOutputType = {
    accountMaps: number
    messages: number
  }

  export type ZaloGroupCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accountMaps?: boolean | ZaloGroupCountOutputTypeCountAccountMapsArgs
    messages?: boolean | ZaloGroupCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * ZaloGroupCountOutputType without action
   */
  export type ZaloGroupCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloGroupCountOutputType
     */
    select?: ZaloGroupCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ZaloGroupCountOutputType without action
   */
  export type ZaloGroupCountOutputTypeCountAccountMapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ZaloAccountGroupWhereInput
  }

  /**
   * ZaloGroupCountOutputType without action
   */
  export type ZaloGroupCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }


  /**
   * Count Type ZaloAccountCountOutputType
   */

  export type ZaloAccountCountOutputType = {
    masters: number
    children: number
    groupMaps: number
    messages: number
    friends: number
    friendOf: number
  }

  export type ZaloAccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    masters?: boolean | ZaloAccountCountOutputTypeCountMastersArgs
    children?: boolean | ZaloAccountCountOutputTypeCountChildrenArgs
    groupMaps?: boolean | ZaloAccountCountOutputTypeCountGroupMapsArgs
    messages?: boolean | ZaloAccountCountOutputTypeCountMessagesArgs
    friends?: boolean | ZaloAccountCountOutputTypeCountFriendsArgs
    friendOf?: boolean | ZaloAccountCountOutputTypeCountFriendOfArgs
  }

  // Custom InputTypes
  /**
   * ZaloAccountCountOutputType without action
   */
  export type ZaloAccountCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountCountOutputType
     */
    select?: ZaloAccountCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ZaloAccountCountOutputType without action
   */
  export type ZaloAccountCountOutputTypeCountMastersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ZaloAccountRelationWhereInput
  }

  /**
   * ZaloAccountCountOutputType without action
   */
  export type ZaloAccountCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ZaloAccountRelationWhereInput
  }

  /**
   * ZaloAccountCountOutputType without action
   */
  export type ZaloAccountCountOutputTypeCountGroupMapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ZaloAccountGroupWhereInput
  }

  /**
   * ZaloAccountCountOutputType without action
   */
  export type ZaloAccountCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }

  /**
   * ZaloAccountCountOutputType without action
   */
  export type ZaloAccountCountOutputTypeCountFriendsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ZaloAccountFriendWhereInput
  }

  /**
   * ZaloAccountCountOutputType without action
   */
  export type ZaloAccountCountOutputTypeCountFriendOfArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ZaloAccountFriendWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    role: $Enums.UserRole | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    role: $Enums.UserRole | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    role: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password: string
    role: $Enums.UserRole
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "role" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      role: $Enums.UserRole
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
  }


  /**
   * Model ZaloGroup
   */

  export type AggregateZaloGroup = {
    _count: ZaloGroupCountAggregateOutputType | null
    _min: ZaloGroupMinAggregateOutputType | null
    _max: ZaloGroupMaxAggregateOutputType | null
  }

  export type ZaloGroupMinAggregateOutputType = {
    id: string | null
    groupName: string | null
    isUpdateName: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ZaloGroupMaxAggregateOutputType = {
    id: string | null
    groupName: string | null
    isUpdateName: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ZaloGroupCountAggregateOutputType = {
    id: number
    groupName: number
    isUpdateName: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ZaloGroupMinAggregateInputType = {
    id?: true
    groupName?: true
    isUpdateName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ZaloGroupMaxAggregateInputType = {
    id?: true
    groupName?: true
    isUpdateName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ZaloGroupCountAggregateInputType = {
    id?: true
    groupName?: true
    isUpdateName?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ZaloGroupAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ZaloGroup to aggregate.
     */
    where?: ZaloGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ZaloGroups to fetch.
     */
    orderBy?: ZaloGroupOrderByWithRelationInput | ZaloGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ZaloGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ZaloGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ZaloGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ZaloGroups
    **/
    _count?: true | ZaloGroupCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ZaloGroupMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ZaloGroupMaxAggregateInputType
  }

  export type GetZaloGroupAggregateType<T extends ZaloGroupAggregateArgs> = {
        [P in keyof T & keyof AggregateZaloGroup]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateZaloGroup[P]>
      : GetScalarType<T[P], AggregateZaloGroup[P]>
  }




  export type ZaloGroupGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ZaloGroupWhereInput
    orderBy?: ZaloGroupOrderByWithAggregationInput | ZaloGroupOrderByWithAggregationInput[]
    by: ZaloGroupScalarFieldEnum[] | ZaloGroupScalarFieldEnum
    having?: ZaloGroupScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ZaloGroupCountAggregateInputType | true
    _min?: ZaloGroupMinAggregateInputType
    _max?: ZaloGroupMaxAggregateInputType
  }

  export type ZaloGroupGroupByOutputType = {
    id: string
    groupName: string
    isUpdateName: boolean
    createdAt: Date
    updatedAt: Date
    _count: ZaloGroupCountAggregateOutputType | null
    _min: ZaloGroupMinAggregateOutputType | null
    _max: ZaloGroupMaxAggregateOutputType | null
  }

  type GetZaloGroupGroupByPayload<T extends ZaloGroupGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ZaloGroupGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ZaloGroupGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ZaloGroupGroupByOutputType[P]>
            : GetScalarType<T[P], ZaloGroupGroupByOutputType[P]>
        }
      >
    >


  export type ZaloGroupSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupName?: boolean
    isUpdateName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accountMaps?: boolean | ZaloGroup$accountMapsArgs<ExtArgs>
    messages?: boolean | ZaloGroup$messagesArgs<ExtArgs>
    _count?: boolean | ZaloGroupCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["zaloGroup"]>

  export type ZaloGroupSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupName?: boolean
    isUpdateName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["zaloGroup"]>

  export type ZaloGroupSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupName?: boolean
    isUpdateName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["zaloGroup"]>

  export type ZaloGroupSelectScalar = {
    id?: boolean
    groupName?: boolean
    isUpdateName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ZaloGroupOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "groupName" | "isUpdateName" | "createdAt" | "updatedAt", ExtArgs["result"]["zaloGroup"]>
  export type ZaloGroupInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accountMaps?: boolean | ZaloGroup$accountMapsArgs<ExtArgs>
    messages?: boolean | ZaloGroup$messagesArgs<ExtArgs>
    _count?: boolean | ZaloGroupCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ZaloGroupIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ZaloGroupIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ZaloGroupPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ZaloGroup"
    objects: {
      accountMaps: Prisma.$ZaloAccountGroupPayload<ExtArgs>[]
      messages: Prisma.$MessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      groupName: string
      isUpdateName: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["zaloGroup"]>
    composites: {}
  }

  type ZaloGroupGetPayload<S extends boolean | null | undefined | ZaloGroupDefaultArgs> = $Result.GetResult<Prisma.$ZaloGroupPayload, S>

  type ZaloGroupCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ZaloGroupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ZaloGroupCountAggregateInputType | true
    }

  export interface ZaloGroupDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ZaloGroup'], meta: { name: 'ZaloGroup' } }
    /**
     * Find zero or one ZaloGroup that matches the filter.
     * @param {ZaloGroupFindUniqueArgs} args - Arguments to find a ZaloGroup
     * @example
     * // Get one ZaloGroup
     * const zaloGroup = await prisma.zaloGroup.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ZaloGroupFindUniqueArgs>(args: SelectSubset<T, ZaloGroupFindUniqueArgs<ExtArgs>>): Prisma__ZaloGroupClient<$Result.GetResult<Prisma.$ZaloGroupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ZaloGroup that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ZaloGroupFindUniqueOrThrowArgs} args - Arguments to find a ZaloGroup
     * @example
     * // Get one ZaloGroup
     * const zaloGroup = await prisma.zaloGroup.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ZaloGroupFindUniqueOrThrowArgs>(args: SelectSubset<T, ZaloGroupFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ZaloGroupClient<$Result.GetResult<Prisma.$ZaloGroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ZaloGroup that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloGroupFindFirstArgs} args - Arguments to find a ZaloGroup
     * @example
     * // Get one ZaloGroup
     * const zaloGroup = await prisma.zaloGroup.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ZaloGroupFindFirstArgs>(args?: SelectSubset<T, ZaloGroupFindFirstArgs<ExtArgs>>): Prisma__ZaloGroupClient<$Result.GetResult<Prisma.$ZaloGroupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ZaloGroup that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloGroupFindFirstOrThrowArgs} args - Arguments to find a ZaloGroup
     * @example
     * // Get one ZaloGroup
     * const zaloGroup = await prisma.zaloGroup.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ZaloGroupFindFirstOrThrowArgs>(args?: SelectSubset<T, ZaloGroupFindFirstOrThrowArgs<ExtArgs>>): Prisma__ZaloGroupClient<$Result.GetResult<Prisma.$ZaloGroupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ZaloGroups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloGroupFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ZaloGroups
     * const zaloGroups = await prisma.zaloGroup.findMany()
     * 
     * // Get first 10 ZaloGroups
     * const zaloGroups = await prisma.zaloGroup.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const zaloGroupWithIdOnly = await prisma.zaloGroup.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ZaloGroupFindManyArgs>(args?: SelectSubset<T, ZaloGroupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloGroupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ZaloGroup.
     * @param {ZaloGroupCreateArgs} args - Arguments to create a ZaloGroup.
     * @example
     * // Create one ZaloGroup
     * const ZaloGroup = await prisma.zaloGroup.create({
     *   data: {
     *     // ... data to create a ZaloGroup
     *   }
     * })
     * 
     */
    create<T extends ZaloGroupCreateArgs>(args: SelectSubset<T, ZaloGroupCreateArgs<ExtArgs>>): Prisma__ZaloGroupClient<$Result.GetResult<Prisma.$ZaloGroupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ZaloGroups.
     * @param {ZaloGroupCreateManyArgs} args - Arguments to create many ZaloGroups.
     * @example
     * // Create many ZaloGroups
     * const zaloGroup = await prisma.zaloGroup.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ZaloGroupCreateManyArgs>(args?: SelectSubset<T, ZaloGroupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ZaloGroups and returns the data saved in the database.
     * @param {ZaloGroupCreateManyAndReturnArgs} args - Arguments to create many ZaloGroups.
     * @example
     * // Create many ZaloGroups
     * const zaloGroup = await prisma.zaloGroup.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ZaloGroups and only return the `id`
     * const zaloGroupWithIdOnly = await prisma.zaloGroup.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ZaloGroupCreateManyAndReturnArgs>(args?: SelectSubset<T, ZaloGroupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloGroupPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ZaloGroup.
     * @param {ZaloGroupDeleteArgs} args - Arguments to delete one ZaloGroup.
     * @example
     * // Delete one ZaloGroup
     * const ZaloGroup = await prisma.zaloGroup.delete({
     *   where: {
     *     // ... filter to delete one ZaloGroup
     *   }
     * })
     * 
     */
    delete<T extends ZaloGroupDeleteArgs>(args: SelectSubset<T, ZaloGroupDeleteArgs<ExtArgs>>): Prisma__ZaloGroupClient<$Result.GetResult<Prisma.$ZaloGroupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ZaloGroup.
     * @param {ZaloGroupUpdateArgs} args - Arguments to update one ZaloGroup.
     * @example
     * // Update one ZaloGroup
     * const zaloGroup = await prisma.zaloGroup.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ZaloGroupUpdateArgs>(args: SelectSubset<T, ZaloGroupUpdateArgs<ExtArgs>>): Prisma__ZaloGroupClient<$Result.GetResult<Prisma.$ZaloGroupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ZaloGroups.
     * @param {ZaloGroupDeleteManyArgs} args - Arguments to filter ZaloGroups to delete.
     * @example
     * // Delete a few ZaloGroups
     * const { count } = await prisma.zaloGroup.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ZaloGroupDeleteManyArgs>(args?: SelectSubset<T, ZaloGroupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ZaloGroups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloGroupUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ZaloGroups
     * const zaloGroup = await prisma.zaloGroup.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ZaloGroupUpdateManyArgs>(args: SelectSubset<T, ZaloGroupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ZaloGroups and returns the data updated in the database.
     * @param {ZaloGroupUpdateManyAndReturnArgs} args - Arguments to update many ZaloGroups.
     * @example
     * // Update many ZaloGroups
     * const zaloGroup = await prisma.zaloGroup.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ZaloGroups and only return the `id`
     * const zaloGroupWithIdOnly = await prisma.zaloGroup.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ZaloGroupUpdateManyAndReturnArgs>(args: SelectSubset<T, ZaloGroupUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloGroupPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ZaloGroup.
     * @param {ZaloGroupUpsertArgs} args - Arguments to update or create a ZaloGroup.
     * @example
     * // Update or create a ZaloGroup
     * const zaloGroup = await prisma.zaloGroup.upsert({
     *   create: {
     *     // ... data to create a ZaloGroup
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ZaloGroup we want to update
     *   }
     * })
     */
    upsert<T extends ZaloGroupUpsertArgs>(args: SelectSubset<T, ZaloGroupUpsertArgs<ExtArgs>>): Prisma__ZaloGroupClient<$Result.GetResult<Prisma.$ZaloGroupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ZaloGroups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloGroupCountArgs} args - Arguments to filter ZaloGroups to count.
     * @example
     * // Count the number of ZaloGroups
     * const count = await prisma.zaloGroup.count({
     *   where: {
     *     // ... the filter for the ZaloGroups we want to count
     *   }
     * })
    **/
    count<T extends ZaloGroupCountArgs>(
      args?: Subset<T, ZaloGroupCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ZaloGroupCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ZaloGroup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloGroupAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ZaloGroupAggregateArgs>(args: Subset<T, ZaloGroupAggregateArgs>): Prisma.PrismaPromise<GetZaloGroupAggregateType<T>>

    /**
     * Group by ZaloGroup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloGroupGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ZaloGroupGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ZaloGroupGroupByArgs['orderBy'] }
        : { orderBy?: ZaloGroupGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ZaloGroupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetZaloGroupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ZaloGroup model
   */
  readonly fields: ZaloGroupFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ZaloGroup.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ZaloGroupClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accountMaps<T extends ZaloGroup$accountMapsArgs<ExtArgs> = {}>(args?: Subset<T, ZaloGroup$accountMapsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloAccountGroupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messages<T extends ZaloGroup$messagesArgs<ExtArgs> = {}>(args?: Subset<T, ZaloGroup$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ZaloGroup model
   */
  interface ZaloGroupFieldRefs {
    readonly id: FieldRef<"ZaloGroup", 'String'>
    readonly groupName: FieldRef<"ZaloGroup", 'String'>
    readonly isUpdateName: FieldRef<"ZaloGroup", 'Boolean'>
    readonly createdAt: FieldRef<"ZaloGroup", 'DateTime'>
    readonly updatedAt: FieldRef<"ZaloGroup", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ZaloGroup findUnique
   */
  export type ZaloGroupFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloGroup
     */
    select?: ZaloGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloGroup
     */
    omit?: ZaloGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloGroupInclude<ExtArgs> | null
    /**
     * Filter, which ZaloGroup to fetch.
     */
    where: ZaloGroupWhereUniqueInput
  }

  /**
   * ZaloGroup findUniqueOrThrow
   */
  export type ZaloGroupFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloGroup
     */
    select?: ZaloGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloGroup
     */
    omit?: ZaloGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloGroupInclude<ExtArgs> | null
    /**
     * Filter, which ZaloGroup to fetch.
     */
    where: ZaloGroupWhereUniqueInput
  }

  /**
   * ZaloGroup findFirst
   */
  export type ZaloGroupFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloGroup
     */
    select?: ZaloGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloGroup
     */
    omit?: ZaloGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloGroupInclude<ExtArgs> | null
    /**
     * Filter, which ZaloGroup to fetch.
     */
    where?: ZaloGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ZaloGroups to fetch.
     */
    orderBy?: ZaloGroupOrderByWithRelationInput | ZaloGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ZaloGroups.
     */
    cursor?: ZaloGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ZaloGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ZaloGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ZaloGroups.
     */
    distinct?: ZaloGroupScalarFieldEnum | ZaloGroupScalarFieldEnum[]
  }

  /**
   * ZaloGroup findFirstOrThrow
   */
  export type ZaloGroupFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloGroup
     */
    select?: ZaloGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloGroup
     */
    omit?: ZaloGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloGroupInclude<ExtArgs> | null
    /**
     * Filter, which ZaloGroup to fetch.
     */
    where?: ZaloGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ZaloGroups to fetch.
     */
    orderBy?: ZaloGroupOrderByWithRelationInput | ZaloGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ZaloGroups.
     */
    cursor?: ZaloGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ZaloGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ZaloGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ZaloGroups.
     */
    distinct?: ZaloGroupScalarFieldEnum | ZaloGroupScalarFieldEnum[]
  }

  /**
   * ZaloGroup findMany
   */
  export type ZaloGroupFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloGroup
     */
    select?: ZaloGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloGroup
     */
    omit?: ZaloGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloGroupInclude<ExtArgs> | null
    /**
     * Filter, which ZaloGroups to fetch.
     */
    where?: ZaloGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ZaloGroups to fetch.
     */
    orderBy?: ZaloGroupOrderByWithRelationInput | ZaloGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ZaloGroups.
     */
    cursor?: ZaloGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ZaloGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ZaloGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ZaloGroups.
     */
    distinct?: ZaloGroupScalarFieldEnum | ZaloGroupScalarFieldEnum[]
  }

  /**
   * ZaloGroup create
   */
  export type ZaloGroupCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloGroup
     */
    select?: ZaloGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloGroup
     */
    omit?: ZaloGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloGroupInclude<ExtArgs> | null
    /**
     * The data needed to create a ZaloGroup.
     */
    data: XOR<ZaloGroupCreateInput, ZaloGroupUncheckedCreateInput>
  }

  /**
   * ZaloGroup createMany
   */
  export type ZaloGroupCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ZaloGroups.
     */
    data: ZaloGroupCreateManyInput | ZaloGroupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ZaloGroup createManyAndReturn
   */
  export type ZaloGroupCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloGroup
     */
    select?: ZaloGroupSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloGroup
     */
    omit?: ZaloGroupOmit<ExtArgs> | null
    /**
     * The data used to create many ZaloGroups.
     */
    data: ZaloGroupCreateManyInput | ZaloGroupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ZaloGroup update
   */
  export type ZaloGroupUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloGroup
     */
    select?: ZaloGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloGroup
     */
    omit?: ZaloGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloGroupInclude<ExtArgs> | null
    /**
     * The data needed to update a ZaloGroup.
     */
    data: XOR<ZaloGroupUpdateInput, ZaloGroupUncheckedUpdateInput>
    /**
     * Choose, which ZaloGroup to update.
     */
    where: ZaloGroupWhereUniqueInput
  }

  /**
   * ZaloGroup updateMany
   */
  export type ZaloGroupUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ZaloGroups.
     */
    data: XOR<ZaloGroupUpdateManyMutationInput, ZaloGroupUncheckedUpdateManyInput>
    /**
     * Filter which ZaloGroups to update
     */
    where?: ZaloGroupWhereInput
    /**
     * Limit how many ZaloGroups to update.
     */
    limit?: number
  }

  /**
   * ZaloGroup updateManyAndReturn
   */
  export type ZaloGroupUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloGroup
     */
    select?: ZaloGroupSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloGroup
     */
    omit?: ZaloGroupOmit<ExtArgs> | null
    /**
     * The data used to update ZaloGroups.
     */
    data: XOR<ZaloGroupUpdateManyMutationInput, ZaloGroupUncheckedUpdateManyInput>
    /**
     * Filter which ZaloGroups to update
     */
    where?: ZaloGroupWhereInput
    /**
     * Limit how many ZaloGroups to update.
     */
    limit?: number
  }

  /**
   * ZaloGroup upsert
   */
  export type ZaloGroupUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloGroup
     */
    select?: ZaloGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloGroup
     */
    omit?: ZaloGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloGroupInclude<ExtArgs> | null
    /**
     * The filter to search for the ZaloGroup to update in case it exists.
     */
    where: ZaloGroupWhereUniqueInput
    /**
     * In case the ZaloGroup found by the `where` argument doesn't exist, create a new ZaloGroup with this data.
     */
    create: XOR<ZaloGroupCreateInput, ZaloGroupUncheckedCreateInput>
    /**
     * In case the ZaloGroup was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ZaloGroupUpdateInput, ZaloGroupUncheckedUpdateInput>
  }

  /**
   * ZaloGroup delete
   */
  export type ZaloGroupDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloGroup
     */
    select?: ZaloGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloGroup
     */
    omit?: ZaloGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloGroupInclude<ExtArgs> | null
    /**
     * Filter which ZaloGroup to delete.
     */
    where: ZaloGroupWhereUniqueInput
  }

  /**
   * ZaloGroup deleteMany
   */
  export type ZaloGroupDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ZaloGroups to delete
     */
    where?: ZaloGroupWhereInput
    /**
     * Limit how many ZaloGroups to delete.
     */
    limit?: number
  }

  /**
   * ZaloGroup.accountMaps
   */
  export type ZaloGroup$accountMapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountGroup
     */
    select?: ZaloAccountGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountGroup
     */
    omit?: ZaloAccountGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountGroupInclude<ExtArgs> | null
    where?: ZaloAccountGroupWhereInput
    orderBy?: ZaloAccountGroupOrderByWithRelationInput | ZaloAccountGroupOrderByWithRelationInput[]
    cursor?: ZaloAccountGroupWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ZaloAccountGroupScalarFieldEnum | ZaloAccountGroupScalarFieldEnum[]
  }

  /**
   * ZaloGroup.messages
   */
  export type ZaloGroup$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * ZaloGroup without action
   */
  export type ZaloGroupDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloGroup
     */
    select?: ZaloGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloGroup
     */
    omit?: ZaloGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloGroupInclude<ExtArgs> | null
  }


  /**
   * Model ZaloAccountRelation
   */

  export type AggregateZaloAccountRelation = {
    _count: ZaloAccountRelationCountAggregateOutputType | null
    _min: ZaloAccountRelationMinAggregateOutputType | null
    _max: ZaloAccountRelationMaxAggregateOutputType | null
  }

  export type ZaloAccountRelationMinAggregateOutputType = {
    id: string | null
    masterId: string | null
    childId: string | null
    createdAt: Date | null
  }

  export type ZaloAccountRelationMaxAggregateOutputType = {
    id: string | null
    masterId: string | null
    childId: string | null
    createdAt: Date | null
  }

  export type ZaloAccountRelationCountAggregateOutputType = {
    id: number
    masterId: number
    childId: number
    createdAt: number
    _all: number
  }


  export type ZaloAccountRelationMinAggregateInputType = {
    id?: true
    masterId?: true
    childId?: true
    createdAt?: true
  }

  export type ZaloAccountRelationMaxAggregateInputType = {
    id?: true
    masterId?: true
    childId?: true
    createdAt?: true
  }

  export type ZaloAccountRelationCountAggregateInputType = {
    id?: true
    masterId?: true
    childId?: true
    createdAt?: true
    _all?: true
  }

  export type ZaloAccountRelationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ZaloAccountRelation to aggregate.
     */
    where?: ZaloAccountRelationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ZaloAccountRelations to fetch.
     */
    orderBy?: ZaloAccountRelationOrderByWithRelationInput | ZaloAccountRelationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ZaloAccountRelationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ZaloAccountRelations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ZaloAccountRelations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ZaloAccountRelations
    **/
    _count?: true | ZaloAccountRelationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ZaloAccountRelationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ZaloAccountRelationMaxAggregateInputType
  }

  export type GetZaloAccountRelationAggregateType<T extends ZaloAccountRelationAggregateArgs> = {
        [P in keyof T & keyof AggregateZaloAccountRelation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateZaloAccountRelation[P]>
      : GetScalarType<T[P], AggregateZaloAccountRelation[P]>
  }




  export type ZaloAccountRelationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ZaloAccountRelationWhereInput
    orderBy?: ZaloAccountRelationOrderByWithAggregationInput | ZaloAccountRelationOrderByWithAggregationInput[]
    by: ZaloAccountRelationScalarFieldEnum[] | ZaloAccountRelationScalarFieldEnum
    having?: ZaloAccountRelationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ZaloAccountRelationCountAggregateInputType | true
    _min?: ZaloAccountRelationMinAggregateInputType
    _max?: ZaloAccountRelationMaxAggregateInputType
  }

  export type ZaloAccountRelationGroupByOutputType = {
    id: string
    masterId: string
    childId: string
    createdAt: Date
    _count: ZaloAccountRelationCountAggregateOutputType | null
    _min: ZaloAccountRelationMinAggregateOutputType | null
    _max: ZaloAccountRelationMaxAggregateOutputType | null
  }

  type GetZaloAccountRelationGroupByPayload<T extends ZaloAccountRelationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ZaloAccountRelationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ZaloAccountRelationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ZaloAccountRelationGroupByOutputType[P]>
            : GetScalarType<T[P], ZaloAccountRelationGroupByOutputType[P]>
        }
      >
    >


  export type ZaloAccountRelationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    masterId?: boolean
    childId?: boolean
    createdAt?: boolean
    master?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    child?: boolean | ZaloAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["zaloAccountRelation"]>

  export type ZaloAccountRelationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    masterId?: boolean
    childId?: boolean
    createdAt?: boolean
    master?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    child?: boolean | ZaloAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["zaloAccountRelation"]>

  export type ZaloAccountRelationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    masterId?: boolean
    childId?: boolean
    createdAt?: boolean
    master?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    child?: boolean | ZaloAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["zaloAccountRelation"]>

  export type ZaloAccountRelationSelectScalar = {
    id?: boolean
    masterId?: boolean
    childId?: boolean
    createdAt?: boolean
  }

  export type ZaloAccountRelationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "masterId" | "childId" | "createdAt", ExtArgs["result"]["zaloAccountRelation"]>
  export type ZaloAccountRelationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    master?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    child?: boolean | ZaloAccountDefaultArgs<ExtArgs>
  }
  export type ZaloAccountRelationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    master?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    child?: boolean | ZaloAccountDefaultArgs<ExtArgs>
  }
  export type ZaloAccountRelationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    master?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    child?: boolean | ZaloAccountDefaultArgs<ExtArgs>
  }

  export type $ZaloAccountRelationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ZaloAccountRelation"
    objects: {
      master: Prisma.$ZaloAccountPayload<ExtArgs>
      child: Prisma.$ZaloAccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      masterId: string
      childId: string
      createdAt: Date
    }, ExtArgs["result"]["zaloAccountRelation"]>
    composites: {}
  }

  type ZaloAccountRelationGetPayload<S extends boolean | null | undefined | ZaloAccountRelationDefaultArgs> = $Result.GetResult<Prisma.$ZaloAccountRelationPayload, S>

  type ZaloAccountRelationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ZaloAccountRelationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ZaloAccountRelationCountAggregateInputType | true
    }

  export interface ZaloAccountRelationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ZaloAccountRelation'], meta: { name: 'ZaloAccountRelation' } }
    /**
     * Find zero or one ZaloAccountRelation that matches the filter.
     * @param {ZaloAccountRelationFindUniqueArgs} args - Arguments to find a ZaloAccountRelation
     * @example
     * // Get one ZaloAccountRelation
     * const zaloAccountRelation = await prisma.zaloAccountRelation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ZaloAccountRelationFindUniqueArgs>(args: SelectSubset<T, ZaloAccountRelationFindUniqueArgs<ExtArgs>>): Prisma__ZaloAccountRelationClient<$Result.GetResult<Prisma.$ZaloAccountRelationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ZaloAccountRelation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ZaloAccountRelationFindUniqueOrThrowArgs} args - Arguments to find a ZaloAccountRelation
     * @example
     * // Get one ZaloAccountRelation
     * const zaloAccountRelation = await prisma.zaloAccountRelation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ZaloAccountRelationFindUniqueOrThrowArgs>(args: SelectSubset<T, ZaloAccountRelationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ZaloAccountRelationClient<$Result.GetResult<Prisma.$ZaloAccountRelationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ZaloAccountRelation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountRelationFindFirstArgs} args - Arguments to find a ZaloAccountRelation
     * @example
     * // Get one ZaloAccountRelation
     * const zaloAccountRelation = await prisma.zaloAccountRelation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ZaloAccountRelationFindFirstArgs>(args?: SelectSubset<T, ZaloAccountRelationFindFirstArgs<ExtArgs>>): Prisma__ZaloAccountRelationClient<$Result.GetResult<Prisma.$ZaloAccountRelationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ZaloAccountRelation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountRelationFindFirstOrThrowArgs} args - Arguments to find a ZaloAccountRelation
     * @example
     * // Get one ZaloAccountRelation
     * const zaloAccountRelation = await prisma.zaloAccountRelation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ZaloAccountRelationFindFirstOrThrowArgs>(args?: SelectSubset<T, ZaloAccountRelationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ZaloAccountRelationClient<$Result.GetResult<Prisma.$ZaloAccountRelationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ZaloAccountRelations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountRelationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ZaloAccountRelations
     * const zaloAccountRelations = await prisma.zaloAccountRelation.findMany()
     * 
     * // Get first 10 ZaloAccountRelations
     * const zaloAccountRelations = await prisma.zaloAccountRelation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const zaloAccountRelationWithIdOnly = await prisma.zaloAccountRelation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ZaloAccountRelationFindManyArgs>(args?: SelectSubset<T, ZaloAccountRelationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloAccountRelationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ZaloAccountRelation.
     * @param {ZaloAccountRelationCreateArgs} args - Arguments to create a ZaloAccountRelation.
     * @example
     * // Create one ZaloAccountRelation
     * const ZaloAccountRelation = await prisma.zaloAccountRelation.create({
     *   data: {
     *     // ... data to create a ZaloAccountRelation
     *   }
     * })
     * 
     */
    create<T extends ZaloAccountRelationCreateArgs>(args: SelectSubset<T, ZaloAccountRelationCreateArgs<ExtArgs>>): Prisma__ZaloAccountRelationClient<$Result.GetResult<Prisma.$ZaloAccountRelationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ZaloAccountRelations.
     * @param {ZaloAccountRelationCreateManyArgs} args - Arguments to create many ZaloAccountRelations.
     * @example
     * // Create many ZaloAccountRelations
     * const zaloAccountRelation = await prisma.zaloAccountRelation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ZaloAccountRelationCreateManyArgs>(args?: SelectSubset<T, ZaloAccountRelationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ZaloAccountRelations and returns the data saved in the database.
     * @param {ZaloAccountRelationCreateManyAndReturnArgs} args - Arguments to create many ZaloAccountRelations.
     * @example
     * // Create many ZaloAccountRelations
     * const zaloAccountRelation = await prisma.zaloAccountRelation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ZaloAccountRelations and only return the `id`
     * const zaloAccountRelationWithIdOnly = await prisma.zaloAccountRelation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ZaloAccountRelationCreateManyAndReturnArgs>(args?: SelectSubset<T, ZaloAccountRelationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloAccountRelationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ZaloAccountRelation.
     * @param {ZaloAccountRelationDeleteArgs} args - Arguments to delete one ZaloAccountRelation.
     * @example
     * // Delete one ZaloAccountRelation
     * const ZaloAccountRelation = await prisma.zaloAccountRelation.delete({
     *   where: {
     *     // ... filter to delete one ZaloAccountRelation
     *   }
     * })
     * 
     */
    delete<T extends ZaloAccountRelationDeleteArgs>(args: SelectSubset<T, ZaloAccountRelationDeleteArgs<ExtArgs>>): Prisma__ZaloAccountRelationClient<$Result.GetResult<Prisma.$ZaloAccountRelationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ZaloAccountRelation.
     * @param {ZaloAccountRelationUpdateArgs} args - Arguments to update one ZaloAccountRelation.
     * @example
     * // Update one ZaloAccountRelation
     * const zaloAccountRelation = await prisma.zaloAccountRelation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ZaloAccountRelationUpdateArgs>(args: SelectSubset<T, ZaloAccountRelationUpdateArgs<ExtArgs>>): Prisma__ZaloAccountRelationClient<$Result.GetResult<Prisma.$ZaloAccountRelationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ZaloAccountRelations.
     * @param {ZaloAccountRelationDeleteManyArgs} args - Arguments to filter ZaloAccountRelations to delete.
     * @example
     * // Delete a few ZaloAccountRelations
     * const { count } = await prisma.zaloAccountRelation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ZaloAccountRelationDeleteManyArgs>(args?: SelectSubset<T, ZaloAccountRelationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ZaloAccountRelations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountRelationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ZaloAccountRelations
     * const zaloAccountRelation = await prisma.zaloAccountRelation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ZaloAccountRelationUpdateManyArgs>(args: SelectSubset<T, ZaloAccountRelationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ZaloAccountRelations and returns the data updated in the database.
     * @param {ZaloAccountRelationUpdateManyAndReturnArgs} args - Arguments to update many ZaloAccountRelations.
     * @example
     * // Update many ZaloAccountRelations
     * const zaloAccountRelation = await prisma.zaloAccountRelation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ZaloAccountRelations and only return the `id`
     * const zaloAccountRelationWithIdOnly = await prisma.zaloAccountRelation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ZaloAccountRelationUpdateManyAndReturnArgs>(args: SelectSubset<T, ZaloAccountRelationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloAccountRelationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ZaloAccountRelation.
     * @param {ZaloAccountRelationUpsertArgs} args - Arguments to update or create a ZaloAccountRelation.
     * @example
     * // Update or create a ZaloAccountRelation
     * const zaloAccountRelation = await prisma.zaloAccountRelation.upsert({
     *   create: {
     *     // ... data to create a ZaloAccountRelation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ZaloAccountRelation we want to update
     *   }
     * })
     */
    upsert<T extends ZaloAccountRelationUpsertArgs>(args: SelectSubset<T, ZaloAccountRelationUpsertArgs<ExtArgs>>): Prisma__ZaloAccountRelationClient<$Result.GetResult<Prisma.$ZaloAccountRelationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ZaloAccountRelations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountRelationCountArgs} args - Arguments to filter ZaloAccountRelations to count.
     * @example
     * // Count the number of ZaloAccountRelations
     * const count = await prisma.zaloAccountRelation.count({
     *   where: {
     *     // ... the filter for the ZaloAccountRelations we want to count
     *   }
     * })
    **/
    count<T extends ZaloAccountRelationCountArgs>(
      args?: Subset<T, ZaloAccountRelationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ZaloAccountRelationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ZaloAccountRelation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountRelationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ZaloAccountRelationAggregateArgs>(args: Subset<T, ZaloAccountRelationAggregateArgs>): Prisma.PrismaPromise<GetZaloAccountRelationAggregateType<T>>

    /**
     * Group by ZaloAccountRelation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountRelationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ZaloAccountRelationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ZaloAccountRelationGroupByArgs['orderBy'] }
        : { orderBy?: ZaloAccountRelationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ZaloAccountRelationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetZaloAccountRelationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ZaloAccountRelation model
   */
  readonly fields: ZaloAccountRelationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ZaloAccountRelation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ZaloAccountRelationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    master<T extends ZaloAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ZaloAccountDefaultArgs<ExtArgs>>): Prisma__ZaloAccountClient<$Result.GetResult<Prisma.$ZaloAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    child<T extends ZaloAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ZaloAccountDefaultArgs<ExtArgs>>): Prisma__ZaloAccountClient<$Result.GetResult<Prisma.$ZaloAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ZaloAccountRelation model
   */
  interface ZaloAccountRelationFieldRefs {
    readonly id: FieldRef<"ZaloAccountRelation", 'String'>
    readonly masterId: FieldRef<"ZaloAccountRelation", 'String'>
    readonly childId: FieldRef<"ZaloAccountRelation", 'String'>
    readonly createdAt: FieldRef<"ZaloAccountRelation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ZaloAccountRelation findUnique
   */
  export type ZaloAccountRelationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountRelation
     */
    select?: ZaloAccountRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountRelation
     */
    omit?: ZaloAccountRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountRelationInclude<ExtArgs> | null
    /**
     * Filter, which ZaloAccountRelation to fetch.
     */
    where: ZaloAccountRelationWhereUniqueInput
  }

  /**
   * ZaloAccountRelation findUniqueOrThrow
   */
  export type ZaloAccountRelationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountRelation
     */
    select?: ZaloAccountRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountRelation
     */
    omit?: ZaloAccountRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountRelationInclude<ExtArgs> | null
    /**
     * Filter, which ZaloAccountRelation to fetch.
     */
    where: ZaloAccountRelationWhereUniqueInput
  }

  /**
   * ZaloAccountRelation findFirst
   */
  export type ZaloAccountRelationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountRelation
     */
    select?: ZaloAccountRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountRelation
     */
    omit?: ZaloAccountRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountRelationInclude<ExtArgs> | null
    /**
     * Filter, which ZaloAccountRelation to fetch.
     */
    where?: ZaloAccountRelationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ZaloAccountRelations to fetch.
     */
    orderBy?: ZaloAccountRelationOrderByWithRelationInput | ZaloAccountRelationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ZaloAccountRelations.
     */
    cursor?: ZaloAccountRelationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ZaloAccountRelations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ZaloAccountRelations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ZaloAccountRelations.
     */
    distinct?: ZaloAccountRelationScalarFieldEnum | ZaloAccountRelationScalarFieldEnum[]
  }

  /**
   * ZaloAccountRelation findFirstOrThrow
   */
  export type ZaloAccountRelationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountRelation
     */
    select?: ZaloAccountRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountRelation
     */
    omit?: ZaloAccountRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountRelationInclude<ExtArgs> | null
    /**
     * Filter, which ZaloAccountRelation to fetch.
     */
    where?: ZaloAccountRelationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ZaloAccountRelations to fetch.
     */
    orderBy?: ZaloAccountRelationOrderByWithRelationInput | ZaloAccountRelationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ZaloAccountRelations.
     */
    cursor?: ZaloAccountRelationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ZaloAccountRelations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ZaloAccountRelations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ZaloAccountRelations.
     */
    distinct?: ZaloAccountRelationScalarFieldEnum | ZaloAccountRelationScalarFieldEnum[]
  }

  /**
   * ZaloAccountRelation findMany
   */
  export type ZaloAccountRelationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountRelation
     */
    select?: ZaloAccountRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountRelation
     */
    omit?: ZaloAccountRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountRelationInclude<ExtArgs> | null
    /**
     * Filter, which ZaloAccountRelations to fetch.
     */
    where?: ZaloAccountRelationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ZaloAccountRelations to fetch.
     */
    orderBy?: ZaloAccountRelationOrderByWithRelationInput | ZaloAccountRelationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ZaloAccountRelations.
     */
    cursor?: ZaloAccountRelationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ZaloAccountRelations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ZaloAccountRelations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ZaloAccountRelations.
     */
    distinct?: ZaloAccountRelationScalarFieldEnum | ZaloAccountRelationScalarFieldEnum[]
  }

  /**
   * ZaloAccountRelation create
   */
  export type ZaloAccountRelationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountRelation
     */
    select?: ZaloAccountRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountRelation
     */
    omit?: ZaloAccountRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountRelationInclude<ExtArgs> | null
    /**
     * The data needed to create a ZaloAccountRelation.
     */
    data: XOR<ZaloAccountRelationCreateInput, ZaloAccountRelationUncheckedCreateInput>
  }

  /**
   * ZaloAccountRelation createMany
   */
  export type ZaloAccountRelationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ZaloAccountRelations.
     */
    data: ZaloAccountRelationCreateManyInput | ZaloAccountRelationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ZaloAccountRelation createManyAndReturn
   */
  export type ZaloAccountRelationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountRelation
     */
    select?: ZaloAccountRelationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountRelation
     */
    omit?: ZaloAccountRelationOmit<ExtArgs> | null
    /**
     * The data used to create many ZaloAccountRelations.
     */
    data: ZaloAccountRelationCreateManyInput | ZaloAccountRelationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountRelationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ZaloAccountRelation update
   */
  export type ZaloAccountRelationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountRelation
     */
    select?: ZaloAccountRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountRelation
     */
    omit?: ZaloAccountRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountRelationInclude<ExtArgs> | null
    /**
     * The data needed to update a ZaloAccountRelation.
     */
    data: XOR<ZaloAccountRelationUpdateInput, ZaloAccountRelationUncheckedUpdateInput>
    /**
     * Choose, which ZaloAccountRelation to update.
     */
    where: ZaloAccountRelationWhereUniqueInput
  }

  /**
   * ZaloAccountRelation updateMany
   */
  export type ZaloAccountRelationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ZaloAccountRelations.
     */
    data: XOR<ZaloAccountRelationUpdateManyMutationInput, ZaloAccountRelationUncheckedUpdateManyInput>
    /**
     * Filter which ZaloAccountRelations to update
     */
    where?: ZaloAccountRelationWhereInput
    /**
     * Limit how many ZaloAccountRelations to update.
     */
    limit?: number
  }

  /**
   * ZaloAccountRelation updateManyAndReturn
   */
  export type ZaloAccountRelationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountRelation
     */
    select?: ZaloAccountRelationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountRelation
     */
    omit?: ZaloAccountRelationOmit<ExtArgs> | null
    /**
     * The data used to update ZaloAccountRelations.
     */
    data: XOR<ZaloAccountRelationUpdateManyMutationInput, ZaloAccountRelationUncheckedUpdateManyInput>
    /**
     * Filter which ZaloAccountRelations to update
     */
    where?: ZaloAccountRelationWhereInput
    /**
     * Limit how many ZaloAccountRelations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountRelationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ZaloAccountRelation upsert
   */
  export type ZaloAccountRelationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountRelation
     */
    select?: ZaloAccountRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountRelation
     */
    omit?: ZaloAccountRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountRelationInclude<ExtArgs> | null
    /**
     * The filter to search for the ZaloAccountRelation to update in case it exists.
     */
    where: ZaloAccountRelationWhereUniqueInput
    /**
     * In case the ZaloAccountRelation found by the `where` argument doesn't exist, create a new ZaloAccountRelation with this data.
     */
    create: XOR<ZaloAccountRelationCreateInput, ZaloAccountRelationUncheckedCreateInput>
    /**
     * In case the ZaloAccountRelation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ZaloAccountRelationUpdateInput, ZaloAccountRelationUncheckedUpdateInput>
  }

  /**
   * ZaloAccountRelation delete
   */
  export type ZaloAccountRelationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountRelation
     */
    select?: ZaloAccountRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountRelation
     */
    omit?: ZaloAccountRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountRelationInclude<ExtArgs> | null
    /**
     * Filter which ZaloAccountRelation to delete.
     */
    where: ZaloAccountRelationWhereUniqueInput
  }

  /**
   * ZaloAccountRelation deleteMany
   */
  export type ZaloAccountRelationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ZaloAccountRelations to delete
     */
    where?: ZaloAccountRelationWhereInput
    /**
     * Limit how many ZaloAccountRelations to delete.
     */
    limit?: number
  }

  /**
   * ZaloAccountRelation without action
   */
  export type ZaloAccountRelationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountRelation
     */
    select?: ZaloAccountRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountRelation
     */
    omit?: ZaloAccountRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountRelationInclude<ExtArgs> | null
  }


  /**
   * Model ZaloAccount
   */

  export type AggregateZaloAccount = {
    _count: ZaloAccountCountAggregateOutputType | null
    _avg: ZaloAccountAvgAggregateOutputType | null
    _sum: ZaloAccountSumAggregateOutputType | null
    _min: ZaloAccountMinAggregateOutputType | null
    _max: ZaloAccountMaxAggregateOutputType | null
  }

  export type ZaloAccountAvgAggregateOutputType = {
    groupCount: number | null
  }

  export type ZaloAccountSumAggregateOutputType = {
    groupCount: number | null
  }

  export type ZaloAccountMinAggregateOutputType = {
    id: string | null
    zaloId: string | null
    phone: string | null
    name: string | null
    isMaster: boolean | null
    groupCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ZaloAccountMaxAggregateOutputType = {
    id: string | null
    zaloId: string | null
    phone: string | null
    name: string | null
    isMaster: boolean | null
    groupCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ZaloAccountCountAggregateOutputType = {
    id: number
    zaloId: number
    phone: number
    name: number
    isMaster: number
    groupCount: number
    groupData: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ZaloAccountAvgAggregateInputType = {
    groupCount?: true
  }

  export type ZaloAccountSumAggregateInputType = {
    groupCount?: true
  }

  export type ZaloAccountMinAggregateInputType = {
    id?: true
    zaloId?: true
    phone?: true
    name?: true
    isMaster?: true
    groupCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ZaloAccountMaxAggregateInputType = {
    id?: true
    zaloId?: true
    phone?: true
    name?: true
    isMaster?: true
    groupCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ZaloAccountCountAggregateInputType = {
    id?: true
    zaloId?: true
    phone?: true
    name?: true
    isMaster?: true
    groupCount?: true
    groupData?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ZaloAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ZaloAccount to aggregate.
     */
    where?: ZaloAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ZaloAccounts to fetch.
     */
    orderBy?: ZaloAccountOrderByWithRelationInput | ZaloAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ZaloAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ZaloAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ZaloAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ZaloAccounts
    **/
    _count?: true | ZaloAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ZaloAccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ZaloAccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ZaloAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ZaloAccountMaxAggregateInputType
  }

  export type GetZaloAccountAggregateType<T extends ZaloAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateZaloAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateZaloAccount[P]>
      : GetScalarType<T[P], AggregateZaloAccount[P]>
  }




  export type ZaloAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ZaloAccountWhereInput
    orderBy?: ZaloAccountOrderByWithAggregationInput | ZaloAccountOrderByWithAggregationInput[]
    by: ZaloAccountScalarFieldEnum[] | ZaloAccountScalarFieldEnum
    having?: ZaloAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ZaloAccountCountAggregateInputType | true
    _avg?: ZaloAccountAvgAggregateInputType
    _sum?: ZaloAccountSumAggregateInputType
    _min?: ZaloAccountMinAggregateInputType
    _max?: ZaloAccountMaxAggregateInputType
  }

  export type ZaloAccountGroupByOutputType = {
    id: string
    zaloId: string | null
    phone: string | null
    name: string | null
    isMaster: boolean
    groupCount: number
    groupData: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: ZaloAccountCountAggregateOutputType | null
    _avg: ZaloAccountAvgAggregateOutputType | null
    _sum: ZaloAccountSumAggregateOutputType | null
    _min: ZaloAccountMinAggregateOutputType | null
    _max: ZaloAccountMaxAggregateOutputType | null
  }

  type GetZaloAccountGroupByPayload<T extends ZaloAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ZaloAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ZaloAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ZaloAccountGroupByOutputType[P]>
            : GetScalarType<T[P], ZaloAccountGroupByOutputType[P]>
        }
      >
    >


  export type ZaloAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    zaloId?: boolean
    phone?: boolean
    name?: boolean
    isMaster?: boolean
    groupCount?: boolean
    groupData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    masters?: boolean | ZaloAccount$mastersArgs<ExtArgs>
    children?: boolean | ZaloAccount$childrenArgs<ExtArgs>
    groupMaps?: boolean | ZaloAccount$groupMapsArgs<ExtArgs>
    messages?: boolean | ZaloAccount$messagesArgs<ExtArgs>
    friends?: boolean | ZaloAccount$friendsArgs<ExtArgs>
    friendOf?: boolean | ZaloAccount$friendOfArgs<ExtArgs>
    _count?: boolean | ZaloAccountCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["zaloAccount"]>

  export type ZaloAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    zaloId?: boolean
    phone?: boolean
    name?: boolean
    isMaster?: boolean
    groupCount?: boolean
    groupData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["zaloAccount"]>

  export type ZaloAccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    zaloId?: boolean
    phone?: boolean
    name?: boolean
    isMaster?: boolean
    groupCount?: boolean
    groupData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["zaloAccount"]>

  export type ZaloAccountSelectScalar = {
    id?: boolean
    zaloId?: boolean
    phone?: boolean
    name?: boolean
    isMaster?: boolean
    groupCount?: boolean
    groupData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ZaloAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "zaloId" | "phone" | "name" | "isMaster" | "groupCount" | "groupData" | "createdAt" | "updatedAt", ExtArgs["result"]["zaloAccount"]>
  export type ZaloAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    masters?: boolean | ZaloAccount$mastersArgs<ExtArgs>
    children?: boolean | ZaloAccount$childrenArgs<ExtArgs>
    groupMaps?: boolean | ZaloAccount$groupMapsArgs<ExtArgs>
    messages?: boolean | ZaloAccount$messagesArgs<ExtArgs>
    friends?: boolean | ZaloAccount$friendsArgs<ExtArgs>
    friendOf?: boolean | ZaloAccount$friendOfArgs<ExtArgs>
    _count?: boolean | ZaloAccountCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ZaloAccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ZaloAccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ZaloAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ZaloAccount"
    objects: {
      masters: Prisma.$ZaloAccountRelationPayload<ExtArgs>[]
      children: Prisma.$ZaloAccountRelationPayload<ExtArgs>[]
      groupMaps: Prisma.$ZaloAccountGroupPayload<ExtArgs>[]
      messages: Prisma.$MessagePayload<ExtArgs>[]
      friends: Prisma.$ZaloAccountFriendPayload<ExtArgs>[]
      friendOf: Prisma.$ZaloAccountFriendPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      zaloId: string | null
      phone: string | null
      name: string | null
      isMaster: boolean
      groupCount: number
      groupData: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["zaloAccount"]>
    composites: {}
  }

  type ZaloAccountGetPayload<S extends boolean | null | undefined | ZaloAccountDefaultArgs> = $Result.GetResult<Prisma.$ZaloAccountPayload, S>

  type ZaloAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ZaloAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ZaloAccountCountAggregateInputType | true
    }

  export interface ZaloAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ZaloAccount'], meta: { name: 'ZaloAccount' } }
    /**
     * Find zero or one ZaloAccount that matches the filter.
     * @param {ZaloAccountFindUniqueArgs} args - Arguments to find a ZaloAccount
     * @example
     * // Get one ZaloAccount
     * const zaloAccount = await prisma.zaloAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ZaloAccountFindUniqueArgs>(args: SelectSubset<T, ZaloAccountFindUniqueArgs<ExtArgs>>): Prisma__ZaloAccountClient<$Result.GetResult<Prisma.$ZaloAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ZaloAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ZaloAccountFindUniqueOrThrowArgs} args - Arguments to find a ZaloAccount
     * @example
     * // Get one ZaloAccount
     * const zaloAccount = await prisma.zaloAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ZaloAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, ZaloAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ZaloAccountClient<$Result.GetResult<Prisma.$ZaloAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ZaloAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountFindFirstArgs} args - Arguments to find a ZaloAccount
     * @example
     * // Get one ZaloAccount
     * const zaloAccount = await prisma.zaloAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ZaloAccountFindFirstArgs>(args?: SelectSubset<T, ZaloAccountFindFirstArgs<ExtArgs>>): Prisma__ZaloAccountClient<$Result.GetResult<Prisma.$ZaloAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ZaloAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountFindFirstOrThrowArgs} args - Arguments to find a ZaloAccount
     * @example
     * // Get one ZaloAccount
     * const zaloAccount = await prisma.zaloAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ZaloAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, ZaloAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__ZaloAccountClient<$Result.GetResult<Prisma.$ZaloAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ZaloAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ZaloAccounts
     * const zaloAccounts = await prisma.zaloAccount.findMany()
     * 
     * // Get first 10 ZaloAccounts
     * const zaloAccounts = await prisma.zaloAccount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const zaloAccountWithIdOnly = await prisma.zaloAccount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ZaloAccountFindManyArgs>(args?: SelectSubset<T, ZaloAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ZaloAccount.
     * @param {ZaloAccountCreateArgs} args - Arguments to create a ZaloAccount.
     * @example
     * // Create one ZaloAccount
     * const ZaloAccount = await prisma.zaloAccount.create({
     *   data: {
     *     // ... data to create a ZaloAccount
     *   }
     * })
     * 
     */
    create<T extends ZaloAccountCreateArgs>(args: SelectSubset<T, ZaloAccountCreateArgs<ExtArgs>>): Prisma__ZaloAccountClient<$Result.GetResult<Prisma.$ZaloAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ZaloAccounts.
     * @param {ZaloAccountCreateManyArgs} args - Arguments to create many ZaloAccounts.
     * @example
     * // Create many ZaloAccounts
     * const zaloAccount = await prisma.zaloAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ZaloAccountCreateManyArgs>(args?: SelectSubset<T, ZaloAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ZaloAccounts and returns the data saved in the database.
     * @param {ZaloAccountCreateManyAndReturnArgs} args - Arguments to create many ZaloAccounts.
     * @example
     * // Create many ZaloAccounts
     * const zaloAccount = await prisma.zaloAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ZaloAccounts and only return the `id`
     * const zaloAccountWithIdOnly = await prisma.zaloAccount.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ZaloAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, ZaloAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloAccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ZaloAccount.
     * @param {ZaloAccountDeleteArgs} args - Arguments to delete one ZaloAccount.
     * @example
     * // Delete one ZaloAccount
     * const ZaloAccount = await prisma.zaloAccount.delete({
     *   where: {
     *     // ... filter to delete one ZaloAccount
     *   }
     * })
     * 
     */
    delete<T extends ZaloAccountDeleteArgs>(args: SelectSubset<T, ZaloAccountDeleteArgs<ExtArgs>>): Prisma__ZaloAccountClient<$Result.GetResult<Prisma.$ZaloAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ZaloAccount.
     * @param {ZaloAccountUpdateArgs} args - Arguments to update one ZaloAccount.
     * @example
     * // Update one ZaloAccount
     * const zaloAccount = await prisma.zaloAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ZaloAccountUpdateArgs>(args: SelectSubset<T, ZaloAccountUpdateArgs<ExtArgs>>): Prisma__ZaloAccountClient<$Result.GetResult<Prisma.$ZaloAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ZaloAccounts.
     * @param {ZaloAccountDeleteManyArgs} args - Arguments to filter ZaloAccounts to delete.
     * @example
     * // Delete a few ZaloAccounts
     * const { count } = await prisma.zaloAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ZaloAccountDeleteManyArgs>(args?: SelectSubset<T, ZaloAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ZaloAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ZaloAccounts
     * const zaloAccount = await prisma.zaloAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ZaloAccountUpdateManyArgs>(args: SelectSubset<T, ZaloAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ZaloAccounts and returns the data updated in the database.
     * @param {ZaloAccountUpdateManyAndReturnArgs} args - Arguments to update many ZaloAccounts.
     * @example
     * // Update many ZaloAccounts
     * const zaloAccount = await prisma.zaloAccount.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ZaloAccounts and only return the `id`
     * const zaloAccountWithIdOnly = await prisma.zaloAccount.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ZaloAccountUpdateManyAndReturnArgs>(args: SelectSubset<T, ZaloAccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloAccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ZaloAccount.
     * @param {ZaloAccountUpsertArgs} args - Arguments to update or create a ZaloAccount.
     * @example
     * // Update or create a ZaloAccount
     * const zaloAccount = await prisma.zaloAccount.upsert({
     *   create: {
     *     // ... data to create a ZaloAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ZaloAccount we want to update
     *   }
     * })
     */
    upsert<T extends ZaloAccountUpsertArgs>(args: SelectSubset<T, ZaloAccountUpsertArgs<ExtArgs>>): Prisma__ZaloAccountClient<$Result.GetResult<Prisma.$ZaloAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ZaloAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountCountArgs} args - Arguments to filter ZaloAccounts to count.
     * @example
     * // Count the number of ZaloAccounts
     * const count = await prisma.zaloAccount.count({
     *   where: {
     *     // ... the filter for the ZaloAccounts we want to count
     *   }
     * })
    **/
    count<T extends ZaloAccountCountArgs>(
      args?: Subset<T, ZaloAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ZaloAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ZaloAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ZaloAccountAggregateArgs>(args: Subset<T, ZaloAccountAggregateArgs>): Prisma.PrismaPromise<GetZaloAccountAggregateType<T>>

    /**
     * Group by ZaloAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ZaloAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ZaloAccountGroupByArgs['orderBy'] }
        : { orderBy?: ZaloAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ZaloAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetZaloAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ZaloAccount model
   */
  readonly fields: ZaloAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ZaloAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ZaloAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    masters<T extends ZaloAccount$mastersArgs<ExtArgs> = {}>(args?: Subset<T, ZaloAccount$mastersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloAccountRelationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    children<T extends ZaloAccount$childrenArgs<ExtArgs> = {}>(args?: Subset<T, ZaloAccount$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloAccountRelationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    groupMaps<T extends ZaloAccount$groupMapsArgs<ExtArgs> = {}>(args?: Subset<T, ZaloAccount$groupMapsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloAccountGroupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messages<T extends ZaloAccount$messagesArgs<ExtArgs> = {}>(args?: Subset<T, ZaloAccount$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    friends<T extends ZaloAccount$friendsArgs<ExtArgs> = {}>(args?: Subset<T, ZaloAccount$friendsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloAccountFriendPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    friendOf<T extends ZaloAccount$friendOfArgs<ExtArgs> = {}>(args?: Subset<T, ZaloAccount$friendOfArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloAccountFriendPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ZaloAccount model
   */
  interface ZaloAccountFieldRefs {
    readonly id: FieldRef<"ZaloAccount", 'String'>
    readonly zaloId: FieldRef<"ZaloAccount", 'String'>
    readonly phone: FieldRef<"ZaloAccount", 'String'>
    readonly name: FieldRef<"ZaloAccount", 'String'>
    readonly isMaster: FieldRef<"ZaloAccount", 'Boolean'>
    readonly groupCount: FieldRef<"ZaloAccount", 'Int'>
    readonly groupData: FieldRef<"ZaloAccount", 'Json'>
    readonly createdAt: FieldRef<"ZaloAccount", 'DateTime'>
    readonly updatedAt: FieldRef<"ZaloAccount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ZaloAccount findUnique
   */
  export type ZaloAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccount
     */
    select?: ZaloAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccount
     */
    omit?: ZaloAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountInclude<ExtArgs> | null
    /**
     * Filter, which ZaloAccount to fetch.
     */
    where: ZaloAccountWhereUniqueInput
  }

  /**
   * ZaloAccount findUniqueOrThrow
   */
  export type ZaloAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccount
     */
    select?: ZaloAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccount
     */
    omit?: ZaloAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountInclude<ExtArgs> | null
    /**
     * Filter, which ZaloAccount to fetch.
     */
    where: ZaloAccountWhereUniqueInput
  }

  /**
   * ZaloAccount findFirst
   */
  export type ZaloAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccount
     */
    select?: ZaloAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccount
     */
    omit?: ZaloAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountInclude<ExtArgs> | null
    /**
     * Filter, which ZaloAccount to fetch.
     */
    where?: ZaloAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ZaloAccounts to fetch.
     */
    orderBy?: ZaloAccountOrderByWithRelationInput | ZaloAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ZaloAccounts.
     */
    cursor?: ZaloAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ZaloAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ZaloAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ZaloAccounts.
     */
    distinct?: ZaloAccountScalarFieldEnum | ZaloAccountScalarFieldEnum[]
  }

  /**
   * ZaloAccount findFirstOrThrow
   */
  export type ZaloAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccount
     */
    select?: ZaloAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccount
     */
    omit?: ZaloAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountInclude<ExtArgs> | null
    /**
     * Filter, which ZaloAccount to fetch.
     */
    where?: ZaloAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ZaloAccounts to fetch.
     */
    orderBy?: ZaloAccountOrderByWithRelationInput | ZaloAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ZaloAccounts.
     */
    cursor?: ZaloAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ZaloAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ZaloAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ZaloAccounts.
     */
    distinct?: ZaloAccountScalarFieldEnum | ZaloAccountScalarFieldEnum[]
  }

  /**
   * ZaloAccount findMany
   */
  export type ZaloAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccount
     */
    select?: ZaloAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccount
     */
    omit?: ZaloAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountInclude<ExtArgs> | null
    /**
     * Filter, which ZaloAccounts to fetch.
     */
    where?: ZaloAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ZaloAccounts to fetch.
     */
    orderBy?: ZaloAccountOrderByWithRelationInput | ZaloAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ZaloAccounts.
     */
    cursor?: ZaloAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ZaloAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ZaloAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ZaloAccounts.
     */
    distinct?: ZaloAccountScalarFieldEnum | ZaloAccountScalarFieldEnum[]
  }

  /**
   * ZaloAccount create
   */
  export type ZaloAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccount
     */
    select?: ZaloAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccount
     */
    omit?: ZaloAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountInclude<ExtArgs> | null
    /**
     * The data needed to create a ZaloAccount.
     */
    data: XOR<ZaloAccountCreateInput, ZaloAccountUncheckedCreateInput>
  }

  /**
   * ZaloAccount createMany
   */
  export type ZaloAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ZaloAccounts.
     */
    data: ZaloAccountCreateManyInput | ZaloAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ZaloAccount createManyAndReturn
   */
  export type ZaloAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccount
     */
    select?: ZaloAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccount
     */
    omit?: ZaloAccountOmit<ExtArgs> | null
    /**
     * The data used to create many ZaloAccounts.
     */
    data: ZaloAccountCreateManyInput | ZaloAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ZaloAccount update
   */
  export type ZaloAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccount
     */
    select?: ZaloAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccount
     */
    omit?: ZaloAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountInclude<ExtArgs> | null
    /**
     * The data needed to update a ZaloAccount.
     */
    data: XOR<ZaloAccountUpdateInput, ZaloAccountUncheckedUpdateInput>
    /**
     * Choose, which ZaloAccount to update.
     */
    where: ZaloAccountWhereUniqueInput
  }

  /**
   * ZaloAccount updateMany
   */
  export type ZaloAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ZaloAccounts.
     */
    data: XOR<ZaloAccountUpdateManyMutationInput, ZaloAccountUncheckedUpdateManyInput>
    /**
     * Filter which ZaloAccounts to update
     */
    where?: ZaloAccountWhereInput
    /**
     * Limit how many ZaloAccounts to update.
     */
    limit?: number
  }

  /**
   * ZaloAccount updateManyAndReturn
   */
  export type ZaloAccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccount
     */
    select?: ZaloAccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccount
     */
    omit?: ZaloAccountOmit<ExtArgs> | null
    /**
     * The data used to update ZaloAccounts.
     */
    data: XOR<ZaloAccountUpdateManyMutationInput, ZaloAccountUncheckedUpdateManyInput>
    /**
     * Filter which ZaloAccounts to update
     */
    where?: ZaloAccountWhereInput
    /**
     * Limit how many ZaloAccounts to update.
     */
    limit?: number
  }

  /**
   * ZaloAccount upsert
   */
  export type ZaloAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccount
     */
    select?: ZaloAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccount
     */
    omit?: ZaloAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountInclude<ExtArgs> | null
    /**
     * The filter to search for the ZaloAccount to update in case it exists.
     */
    where: ZaloAccountWhereUniqueInput
    /**
     * In case the ZaloAccount found by the `where` argument doesn't exist, create a new ZaloAccount with this data.
     */
    create: XOR<ZaloAccountCreateInput, ZaloAccountUncheckedCreateInput>
    /**
     * In case the ZaloAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ZaloAccountUpdateInput, ZaloAccountUncheckedUpdateInput>
  }

  /**
   * ZaloAccount delete
   */
  export type ZaloAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccount
     */
    select?: ZaloAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccount
     */
    omit?: ZaloAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountInclude<ExtArgs> | null
    /**
     * Filter which ZaloAccount to delete.
     */
    where: ZaloAccountWhereUniqueInput
  }

  /**
   * ZaloAccount deleteMany
   */
  export type ZaloAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ZaloAccounts to delete
     */
    where?: ZaloAccountWhereInput
    /**
     * Limit how many ZaloAccounts to delete.
     */
    limit?: number
  }

  /**
   * ZaloAccount.masters
   */
  export type ZaloAccount$mastersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountRelation
     */
    select?: ZaloAccountRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountRelation
     */
    omit?: ZaloAccountRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountRelationInclude<ExtArgs> | null
    where?: ZaloAccountRelationWhereInput
    orderBy?: ZaloAccountRelationOrderByWithRelationInput | ZaloAccountRelationOrderByWithRelationInput[]
    cursor?: ZaloAccountRelationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ZaloAccountRelationScalarFieldEnum | ZaloAccountRelationScalarFieldEnum[]
  }

  /**
   * ZaloAccount.children
   */
  export type ZaloAccount$childrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountRelation
     */
    select?: ZaloAccountRelationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountRelation
     */
    omit?: ZaloAccountRelationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountRelationInclude<ExtArgs> | null
    where?: ZaloAccountRelationWhereInput
    orderBy?: ZaloAccountRelationOrderByWithRelationInput | ZaloAccountRelationOrderByWithRelationInput[]
    cursor?: ZaloAccountRelationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ZaloAccountRelationScalarFieldEnum | ZaloAccountRelationScalarFieldEnum[]
  }

  /**
   * ZaloAccount.groupMaps
   */
  export type ZaloAccount$groupMapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountGroup
     */
    select?: ZaloAccountGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountGroup
     */
    omit?: ZaloAccountGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountGroupInclude<ExtArgs> | null
    where?: ZaloAccountGroupWhereInput
    orderBy?: ZaloAccountGroupOrderByWithRelationInput | ZaloAccountGroupOrderByWithRelationInput[]
    cursor?: ZaloAccountGroupWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ZaloAccountGroupScalarFieldEnum | ZaloAccountGroupScalarFieldEnum[]
  }

  /**
   * ZaloAccount.messages
   */
  export type ZaloAccount$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * ZaloAccount.friends
   */
  export type ZaloAccount$friendsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountFriend
     */
    select?: ZaloAccountFriendSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountFriend
     */
    omit?: ZaloAccountFriendOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountFriendInclude<ExtArgs> | null
    where?: ZaloAccountFriendWhereInput
    orderBy?: ZaloAccountFriendOrderByWithRelationInput | ZaloAccountFriendOrderByWithRelationInput[]
    cursor?: ZaloAccountFriendWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ZaloAccountFriendScalarFieldEnum | ZaloAccountFriendScalarFieldEnum[]
  }

  /**
   * ZaloAccount.friendOf
   */
  export type ZaloAccount$friendOfArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountFriend
     */
    select?: ZaloAccountFriendSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountFriend
     */
    omit?: ZaloAccountFriendOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountFriendInclude<ExtArgs> | null
    where?: ZaloAccountFriendWhereInput
    orderBy?: ZaloAccountFriendOrderByWithRelationInput | ZaloAccountFriendOrderByWithRelationInput[]
    cursor?: ZaloAccountFriendWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ZaloAccountFriendScalarFieldEnum | ZaloAccountFriendScalarFieldEnum[]
  }

  /**
   * ZaloAccount without action
   */
  export type ZaloAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccount
     */
    select?: ZaloAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccount
     */
    omit?: ZaloAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountInclude<ExtArgs> | null
  }


  /**
   * Model ZaloAccountGroup
   */

  export type AggregateZaloAccountGroup = {
    _count: ZaloAccountGroupCountAggregateOutputType | null
    _min: ZaloAccountGroupMinAggregateOutputType | null
    _max: ZaloAccountGroupMaxAggregateOutputType | null
  }

  export type ZaloAccountGroupMinAggregateOutputType = {
    id: string | null
    groupZaloId: string | null
    zaloAccountId: string | null
    groupId: string | null
    joinedAt: Date | null
  }

  export type ZaloAccountGroupMaxAggregateOutputType = {
    id: string | null
    groupZaloId: string | null
    zaloAccountId: string | null
    groupId: string | null
    joinedAt: Date | null
  }

  export type ZaloAccountGroupCountAggregateOutputType = {
    id: number
    groupZaloId: number
    zaloAccountId: number
    groupId: number
    joinedAt: number
    _all: number
  }


  export type ZaloAccountGroupMinAggregateInputType = {
    id?: true
    groupZaloId?: true
    zaloAccountId?: true
    groupId?: true
    joinedAt?: true
  }

  export type ZaloAccountGroupMaxAggregateInputType = {
    id?: true
    groupZaloId?: true
    zaloAccountId?: true
    groupId?: true
    joinedAt?: true
  }

  export type ZaloAccountGroupCountAggregateInputType = {
    id?: true
    groupZaloId?: true
    zaloAccountId?: true
    groupId?: true
    joinedAt?: true
    _all?: true
  }

  export type ZaloAccountGroupAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ZaloAccountGroup to aggregate.
     */
    where?: ZaloAccountGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ZaloAccountGroups to fetch.
     */
    orderBy?: ZaloAccountGroupOrderByWithRelationInput | ZaloAccountGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ZaloAccountGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ZaloAccountGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ZaloAccountGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ZaloAccountGroups
    **/
    _count?: true | ZaloAccountGroupCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ZaloAccountGroupMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ZaloAccountGroupMaxAggregateInputType
  }

  export type GetZaloAccountGroupAggregateType<T extends ZaloAccountGroupAggregateArgs> = {
        [P in keyof T & keyof AggregateZaloAccountGroup]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateZaloAccountGroup[P]>
      : GetScalarType<T[P], AggregateZaloAccountGroup[P]>
  }




  export type ZaloAccountGroupGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ZaloAccountGroupWhereInput
    orderBy?: ZaloAccountGroupOrderByWithAggregationInput | ZaloAccountGroupOrderByWithAggregationInput[]
    by: ZaloAccountGroupScalarFieldEnum[] | ZaloAccountGroupScalarFieldEnum
    having?: ZaloAccountGroupScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ZaloAccountGroupCountAggregateInputType | true
    _min?: ZaloAccountGroupMinAggregateInputType
    _max?: ZaloAccountGroupMaxAggregateInputType
  }

  export type ZaloAccountGroupGroupByOutputType = {
    id: string
    groupZaloId: string
    zaloAccountId: string
    groupId: string
    joinedAt: Date
    _count: ZaloAccountGroupCountAggregateOutputType | null
    _min: ZaloAccountGroupMinAggregateOutputType | null
    _max: ZaloAccountGroupMaxAggregateOutputType | null
  }

  type GetZaloAccountGroupGroupByPayload<T extends ZaloAccountGroupGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ZaloAccountGroupGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ZaloAccountGroupGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ZaloAccountGroupGroupByOutputType[P]>
            : GetScalarType<T[P], ZaloAccountGroupGroupByOutputType[P]>
        }
      >
    >


  export type ZaloAccountGroupSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupZaloId?: boolean
    zaloAccountId?: boolean
    groupId?: boolean
    joinedAt?: boolean
    zaloAccount?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    group?: boolean | ZaloGroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["zaloAccountGroup"]>

  export type ZaloAccountGroupSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupZaloId?: boolean
    zaloAccountId?: boolean
    groupId?: boolean
    joinedAt?: boolean
    zaloAccount?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    group?: boolean | ZaloGroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["zaloAccountGroup"]>

  export type ZaloAccountGroupSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupZaloId?: boolean
    zaloAccountId?: boolean
    groupId?: boolean
    joinedAt?: boolean
    zaloAccount?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    group?: boolean | ZaloGroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["zaloAccountGroup"]>

  export type ZaloAccountGroupSelectScalar = {
    id?: boolean
    groupZaloId?: boolean
    zaloAccountId?: boolean
    groupId?: boolean
    joinedAt?: boolean
  }

  export type ZaloAccountGroupOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "groupZaloId" | "zaloAccountId" | "groupId" | "joinedAt", ExtArgs["result"]["zaloAccountGroup"]>
  export type ZaloAccountGroupInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    zaloAccount?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    group?: boolean | ZaloGroupDefaultArgs<ExtArgs>
  }
  export type ZaloAccountGroupIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    zaloAccount?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    group?: boolean | ZaloGroupDefaultArgs<ExtArgs>
  }
  export type ZaloAccountGroupIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    zaloAccount?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    group?: boolean | ZaloGroupDefaultArgs<ExtArgs>
  }

  export type $ZaloAccountGroupPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ZaloAccountGroup"
    objects: {
      zaloAccount: Prisma.$ZaloAccountPayload<ExtArgs>
      group: Prisma.$ZaloGroupPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      groupZaloId: string
      zaloAccountId: string
      groupId: string
      joinedAt: Date
    }, ExtArgs["result"]["zaloAccountGroup"]>
    composites: {}
  }

  type ZaloAccountGroupGetPayload<S extends boolean | null | undefined | ZaloAccountGroupDefaultArgs> = $Result.GetResult<Prisma.$ZaloAccountGroupPayload, S>

  type ZaloAccountGroupCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ZaloAccountGroupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ZaloAccountGroupCountAggregateInputType | true
    }

  export interface ZaloAccountGroupDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ZaloAccountGroup'], meta: { name: 'ZaloAccountGroup' } }
    /**
     * Find zero or one ZaloAccountGroup that matches the filter.
     * @param {ZaloAccountGroupFindUniqueArgs} args - Arguments to find a ZaloAccountGroup
     * @example
     * // Get one ZaloAccountGroup
     * const zaloAccountGroup = await prisma.zaloAccountGroup.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ZaloAccountGroupFindUniqueArgs>(args: SelectSubset<T, ZaloAccountGroupFindUniqueArgs<ExtArgs>>): Prisma__ZaloAccountGroupClient<$Result.GetResult<Prisma.$ZaloAccountGroupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ZaloAccountGroup that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ZaloAccountGroupFindUniqueOrThrowArgs} args - Arguments to find a ZaloAccountGroup
     * @example
     * // Get one ZaloAccountGroup
     * const zaloAccountGroup = await prisma.zaloAccountGroup.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ZaloAccountGroupFindUniqueOrThrowArgs>(args: SelectSubset<T, ZaloAccountGroupFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ZaloAccountGroupClient<$Result.GetResult<Prisma.$ZaloAccountGroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ZaloAccountGroup that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountGroupFindFirstArgs} args - Arguments to find a ZaloAccountGroup
     * @example
     * // Get one ZaloAccountGroup
     * const zaloAccountGroup = await prisma.zaloAccountGroup.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ZaloAccountGroupFindFirstArgs>(args?: SelectSubset<T, ZaloAccountGroupFindFirstArgs<ExtArgs>>): Prisma__ZaloAccountGroupClient<$Result.GetResult<Prisma.$ZaloAccountGroupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ZaloAccountGroup that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountGroupFindFirstOrThrowArgs} args - Arguments to find a ZaloAccountGroup
     * @example
     * // Get one ZaloAccountGroup
     * const zaloAccountGroup = await prisma.zaloAccountGroup.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ZaloAccountGroupFindFirstOrThrowArgs>(args?: SelectSubset<T, ZaloAccountGroupFindFirstOrThrowArgs<ExtArgs>>): Prisma__ZaloAccountGroupClient<$Result.GetResult<Prisma.$ZaloAccountGroupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ZaloAccountGroups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountGroupFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ZaloAccountGroups
     * const zaloAccountGroups = await prisma.zaloAccountGroup.findMany()
     * 
     * // Get first 10 ZaloAccountGroups
     * const zaloAccountGroups = await prisma.zaloAccountGroup.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const zaloAccountGroupWithIdOnly = await prisma.zaloAccountGroup.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ZaloAccountGroupFindManyArgs>(args?: SelectSubset<T, ZaloAccountGroupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloAccountGroupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ZaloAccountGroup.
     * @param {ZaloAccountGroupCreateArgs} args - Arguments to create a ZaloAccountGroup.
     * @example
     * // Create one ZaloAccountGroup
     * const ZaloAccountGroup = await prisma.zaloAccountGroup.create({
     *   data: {
     *     // ... data to create a ZaloAccountGroup
     *   }
     * })
     * 
     */
    create<T extends ZaloAccountGroupCreateArgs>(args: SelectSubset<T, ZaloAccountGroupCreateArgs<ExtArgs>>): Prisma__ZaloAccountGroupClient<$Result.GetResult<Prisma.$ZaloAccountGroupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ZaloAccountGroups.
     * @param {ZaloAccountGroupCreateManyArgs} args - Arguments to create many ZaloAccountGroups.
     * @example
     * // Create many ZaloAccountGroups
     * const zaloAccountGroup = await prisma.zaloAccountGroup.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ZaloAccountGroupCreateManyArgs>(args?: SelectSubset<T, ZaloAccountGroupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ZaloAccountGroups and returns the data saved in the database.
     * @param {ZaloAccountGroupCreateManyAndReturnArgs} args - Arguments to create many ZaloAccountGroups.
     * @example
     * // Create many ZaloAccountGroups
     * const zaloAccountGroup = await prisma.zaloAccountGroup.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ZaloAccountGroups and only return the `id`
     * const zaloAccountGroupWithIdOnly = await prisma.zaloAccountGroup.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ZaloAccountGroupCreateManyAndReturnArgs>(args?: SelectSubset<T, ZaloAccountGroupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloAccountGroupPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ZaloAccountGroup.
     * @param {ZaloAccountGroupDeleteArgs} args - Arguments to delete one ZaloAccountGroup.
     * @example
     * // Delete one ZaloAccountGroup
     * const ZaloAccountGroup = await prisma.zaloAccountGroup.delete({
     *   where: {
     *     // ... filter to delete one ZaloAccountGroup
     *   }
     * })
     * 
     */
    delete<T extends ZaloAccountGroupDeleteArgs>(args: SelectSubset<T, ZaloAccountGroupDeleteArgs<ExtArgs>>): Prisma__ZaloAccountGroupClient<$Result.GetResult<Prisma.$ZaloAccountGroupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ZaloAccountGroup.
     * @param {ZaloAccountGroupUpdateArgs} args - Arguments to update one ZaloAccountGroup.
     * @example
     * // Update one ZaloAccountGroup
     * const zaloAccountGroup = await prisma.zaloAccountGroup.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ZaloAccountGroupUpdateArgs>(args: SelectSubset<T, ZaloAccountGroupUpdateArgs<ExtArgs>>): Prisma__ZaloAccountGroupClient<$Result.GetResult<Prisma.$ZaloAccountGroupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ZaloAccountGroups.
     * @param {ZaloAccountGroupDeleteManyArgs} args - Arguments to filter ZaloAccountGroups to delete.
     * @example
     * // Delete a few ZaloAccountGroups
     * const { count } = await prisma.zaloAccountGroup.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ZaloAccountGroupDeleteManyArgs>(args?: SelectSubset<T, ZaloAccountGroupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ZaloAccountGroups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountGroupUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ZaloAccountGroups
     * const zaloAccountGroup = await prisma.zaloAccountGroup.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ZaloAccountGroupUpdateManyArgs>(args: SelectSubset<T, ZaloAccountGroupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ZaloAccountGroups and returns the data updated in the database.
     * @param {ZaloAccountGroupUpdateManyAndReturnArgs} args - Arguments to update many ZaloAccountGroups.
     * @example
     * // Update many ZaloAccountGroups
     * const zaloAccountGroup = await prisma.zaloAccountGroup.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ZaloAccountGroups and only return the `id`
     * const zaloAccountGroupWithIdOnly = await prisma.zaloAccountGroup.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ZaloAccountGroupUpdateManyAndReturnArgs>(args: SelectSubset<T, ZaloAccountGroupUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloAccountGroupPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ZaloAccountGroup.
     * @param {ZaloAccountGroupUpsertArgs} args - Arguments to update or create a ZaloAccountGroup.
     * @example
     * // Update or create a ZaloAccountGroup
     * const zaloAccountGroup = await prisma.zaloAccountGroup.upsert({
     *   create: {
     *     // ... data to create a ZaloAccountGroup
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ZaloAccountGroup we want to update
     *   }
     * })
     */
    upsert<T extends ZaloAccountGroupUpsertArgs>(args: SelectSubset<T, ZaloAccountGroupUpsertArgs<ExtArgs>>): Prisma__ZaloAccountGroupClient<$Result.GetResult<Prisma.$ZaloAccountGroupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ZaloAccountGroups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountGroupCountArgs} args - Arguments to filter ZaloAccountGroups to count.
     * @example
     * // Count the number of ZaloAccountGroups
     * const count = await prisma.zaloAccountGroup.count({
     *   where: {
     *     // ... the filter for the ZaloAccountGroups we want to count
     *   }
     * })
    **/
    count<T extends ZaloAccountGroupCountArgs>(
      args?: Subset<T, ZaloAccountGroupCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ZaloAccountGroupCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ZaloAccountGroup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountGroupAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ZaloAccountGroupAggregateArgs>(args: Subset<T, ZaloAccountGroupAggregateArgs>): Prisma.PrismaPromise<GetZaloAccountGroupAggregateType<T>>

    /**
     * Group by ZaloAccountGroup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountGroupGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ZaloAccountGroupGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ZaloAccountGroupGroupByArgs['orderBy'] }
        : { orderBy?: ZaloAccountGroupGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ZaloAccountGroupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetZaloAccountGroupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ZaloAccountGroup model
   */
  readonly fields: ZaloAccountGroupFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ZaloAccountGroup.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ZaloAccountGroupClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    zaloAccount<T extends ZaloAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ZaloAccountDefaultArgs<ExtArgs>>): Prisma__ZaloAccountClient<$Result.GetResult<Prisma.$ZaloAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    group<T extends ZaloGroupDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ZaloGroupDefaultArgs<ExtArgs>>): Prisma__ZaloGroupClient<$Result.GetResult<Prisma.$ZaloGroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ZaloAccountGroup model
   */
  interface ZaloAccountGroupFieldRefs {
    readonly id: FieldRef<"ZaloAccountGroup", 'String'>
    readonly groupZaloId: FieldRef<"ZaloAccountGroup", 'String'>
    readonly zaloAccountId: FieldRef<"ZaloAccountGroup", 'String'>
    readonly groupId: FieldRef<"ZaloAccountGroup", 'String'>
    readonly joinedAt: FieldRef<"ZaloAccountGroup", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ZaloAccountGroup findUnique
   */
  export type ZaloAccountGroupFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountGroup
     */
    select?: ZaloAccountGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountGroup
     */
    omit?: ZaloAccountGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountGroupInclude<ExtArgs> | null
    /**
     * Filter, which ZaloAccountGroup to fetch.
     */
    where: ZaloAccountGroupWhereUniqueInput
  }

  /**
   * ZaloAccountGroup findUniqueOrThrow
   */
  export type ZaloAccountGroupFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountGroup
     */
    select?: ZaloAccountGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountGroup
     */
    omit?: ZaloAccountGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountGroupInclude<ExtArgs> | null
    /**
     * Filter, which ZaloAccountGroup to fetch.
     */
    where: ZaloAccountGroupWhereUniqueInput
  }

  /**
   * ZaloAccountGroup findFirst
   */
  export type ZaloAccountGroupFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountGroup
     */
    select?: ZaloAccountGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountGroup
     */
    omit?: ZaloAccountGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountGroupInclude<ExtArgs> | null
    /**
     * Filter, which ZaloAccountGroup to fetch.
     */
    where?: ZaloAccountGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ZaloAccountGroups to fetch.
     */
    orderBy?: ZaloAccountGroupOrderByWithRelationInput | ZaloAccountGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ZaloAccountGroups.
     */
    cursor?: ZaloAccountGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ZaloAccountGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ZaloAccountGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ZaloAccountGroups.
     */
    distinct?: ZaloAccountGroupScalarFieldEnum | ZaloAccountGroupScalarFieldEnum[]
  }

  /**
   * ZaloAccountGroup findFirstOrThrow
   */
  export type ZaloAccountGroupFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountGroup
     */
    select?: ZaloAccountGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountGroup
     */
    omit?: ZaloAccountGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountGroupInclude<ExtArgs> | null
    /**
     * Filter, which ZaloAccountGroup to fetch.
     */
    where?: ZaloAccountGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ZaloAccountGroups to fetch.
     */
    orderBy?: ZaloAccountGroupOrderByWithRelationInput | ZaloAccountGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ZaloAccountGroups.
     */
    cursor?: ZaloAccountGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ZaloAccountGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ZaloAccountGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ZaloAccountGroups.
     */
    distinct?: ZaloAccountGroupScalarFieldEnum | ZaloAccountGroupScalarFieldEnum[]
  }

  /**
   * ZaloAccountGroup findMany
   */
  export type ZaloAccountGroupFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountGroup
     */
    select?: ZaloAccountGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountGroup
     */
    omit?: ZaloAccountGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountGroupInclude<ExtArgs> | null
    /**
     * Filter, which ZaloAccountGroups to fetch.
     */
    where?: ZaloAccountGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ZaloAccountGroups to fetch.
     */
    orderBy?: ZaloAccountGroupOrderByWithRelationInput | ZaloAccountGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ZaloAccountGroups.
     */
    cursor?: ZaloAccountGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ZaloAccountGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ZaloAccountGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ZaloAccountGroups.
     */
    distinct?: ZaloAccountGroupScalarFieldEnum | ZaloAccountGroupScalarFieldEnum[]
  }

  /**
   * ZaloAccountGroup create
   */
  export type ZaloAccountGroupCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountGroup
     */
    select?: ZaloAccountGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountGroup
     */
    omit?: ZaloAccountGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountGroupInclude<ExtArgs> | null
    /**
     * The data needed to create a ZaloAccountGroup.
     */
    data: XOR<ZaloAccountGroupCreateInput, ZaloAccountGroupUncheckedCreateInput>
  }

  /**
   * ZaloAccountGroup createMany
   */
  export type ZaloAccountGroupCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ZaloAccountGroups.
     */
    data: ZaloAccountGroupCreateManyInput | ZaloAccountGroupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ZaloAccountGroup createManyAndReturn
   */
  export type ZaloAccountGroupCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountGroup
     */
    select?: ZaloAccountGroupSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountGroup
     */
    omit?: ZaloAccountGroupOmit<ExtArgs> | null
    /**
     * The data used to create many ZaloAccountGroups.
     */
    data: ZaloAccountGroupCreateManyInput | ZaloAccountGroupCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountGroupIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ZaloAccountGroup update
   */
  export type ZaloAccountGroupUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountGroup
     */
    select?: ZaloAccountGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountGroup
     */
    omit?: ZaloAccountGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountGroupInclude<ExtArgs> | null
    /**
     * The data needed to update a ZaloAccountGroup.
     */
    data: XOR<ZaloAccountGroupUpdateInput, ZaloAccountGroupUncheckedUpdateInput>
    /**
     * Choose, which ZaloAccountGroup to update.
     */
    where: ZaloAccountGroupWhereUniqueInput
  }

  /**
   * ZaloAccountGroup updateMany
   */
  export type ZaloAccountGroupUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ZaloAccountGroups.
     */
    data: XOR<ZaloAccountGroupUpdateManyMutationInput, ZaloAccountGroupUncheckedUpdateManyInput>
    /**
     * Filter which ZaloAccountGroups to update
     */
    where?: ZaloAccountGroupWhereInput
    /**
     * Limit how many ZaloAccountGroups to update.
     */
    limit?: number
  }

  /**
   * ZaloAccountGroup updateManyAndReturn
   */
  export type ZaloAccountGroupUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountGroup
     */
    select?: ZaloAccountGroupSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountGroup
     */
    omit?: ZaloAccountGroupOmit<ExtArgs> | null
    /**
     * The data used to update ZaloAccountGroups.
     */
    data: XOR<ZaloAccountGroupUpdateManyMutationInput, ZaloAccountGroupUncheckedUpdateManyInput>
    /**
     * Filter which ZaloAccountGroups to update
     */
    where?: ZaloAccountGroupWhereInput
    /**
     * Limit how many ZaloAccountGroups to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountGroupIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ZaloAccountGroup upsert
   */
  export type ZaloAccountGroupUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountGroup
     */
    select?: ZaloAccountGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountGroup
     */
    omit?: ZaloAccountGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountGroupInclude<ExtArgs> | null
    /**
     * The filter to search for the ZaloAccountGroup to update in case it exists.
     */
    where: ZaloAccountGroupWhereUniqueInput
    /**
     * In case the ZaloAccountGroup found by the `where` argument doesn't exist, create a new ZaloAccountGroup with this data.
     */
    create: XOR<ZaloAccountGroupCreateInput, ZaloAccountGroupUncheckedCreateInput>
    /**
     * In case the ZaloAccountGroup was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ZaloAccountGroupUpdateInput, ZaloAccountGroupUncheckedUpdateInput>
  }

  /**
   * ZaloAccountGroup delete
   */
  export type ZaloAccountGroupDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountGroup
     */
    select?: ZaloAccountGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountGroup
     */
    omit?: ZaloAccountGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountGroupInclude<ExtArgs> | null
    /**
     * Filter which ZaloAccountGroup to delete.
     */
    where: ZaloAccountGroupWhereUniqueInput
  }

  /**
   * ZaloAccountGroup deleteMany
   */
  export type ZaloAccountGroupDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ZaloAccountGroups to delete
     */
    where?: ZaloAccountGroupWhereInput
    /**
     * Limit how many ZaloAccountGroups to delete.
     */
    limit?: number
  }

  /**
   * ZaloAccountGroup without action
   */
  export type ZaloAccountGroupDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountGroup
     */
    select?: ZaloAccountGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountGroup
     */
    omit?: ZaloAccountGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountGroupInclude<ExtArgs> | null
  }


  /**
   * Model ZaloAccountFriend
   */

  export type AggregateZaloAccountFriend = {
    _count: ZaloAccountFriendCountAggregateOutputType | null
    _min: ZaloAccountFriendMinAggregateOutputType | null
    _max: ZaloAccountFriendMaxAggregateOutputType | null
  }

  export type ZaloAccountFriendMinAggregateOutputType = {
    id: string | null
    masterId: string | null
    friendId: string | null
    status: $Enums.ZaloAccountFriendStatus | null
    createdAt: Date | null
  }

  export type ZaloAccountFriendMaxAggregateOutputType = {
    id: string | null
    masterId: string | null
    friendId: string | null
    status: $Enums.ZaloAccountFriendStatus | null
    createdAt: Date | null
  }

  export type ZaloAccountFriendCountAggregateOutputType = {
    id: number
    masterId: number
    friendId: number
    status: number
    createdAt: number
    _all: number
  }


  export type ZaloAccountFriendMinAggregateInputType = {
    id?: true
    masterId?: true
    friendId?: true
    status?: true
    createdAt?: true
  }

  export type ZaloAccountFriendMaxAggregateInputType = {
    id?: true
    masterId?: true
    friendId?: true
    status?: true
    createdAt?: true
  }

  export type ZaloAccountFriendCountAggregateInputType = {
    id?: true
    masterId?: true
    friendId?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type ZaloAccountFriendAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ZaloAccountFriend to aggregate.
     */
    where?: ZaloAccountFriendWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ZaloAccountFriends to fetch.
     */
    orderBy?: ZaloAccountFriendOrderByWithRelationInput | ZaloAccountFriendOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ZaloAccountFriendWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ZaloAccountFriends from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ZaloAccountFriends.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ZaloAccountFriends
    **/
    _count?: true | ZaloAccountFriendCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ZaloAccountFriendMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ZaloAccountFriendMaxAggregateInputType
  }

  export type GetZaloAccountFriendAggregateType<T extends ZaloAccountFriendAggregateArgs> = {
        [P in keyof T & keyof AggregateZaloAccountFriend]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateZaloAccountFriend[P]>
      : GetScalarType<T[P], AggregateZaloAccountFriend[P]>
  }




  export type ZaloAccountFriendGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ZaloAccountFriendWhereInput
    orderBy?: ZaloAccountFriendOrderByWithAggregationInput | ZaloAccountFriendOrderByWithAggregationInput[]
    by: ZaloAccountFriendScalarFieldEnum[] | ZaloAccountFriendScalarFieldEnum
    having?: ZaloAccountFriendScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ZaloAccountFriendCountAggregateInputType | true
    _min?: ZaloAccountFriendMinAggregateInputType
    _max?: ZaloAccountFriendMaxAggregateInputType
  }

  export type ZaloAccountFriendGroupByOutputType = {
    id: string
    masterId: string
    friendId: string
    status: $Enums.ZaloAccountFriendStatus
    createdAt: Date
    _count: ZaloAccountFriendCountAggregateOutputType | null
    _min: ZaloAccountFriendMinAggregateOutputType | null
    _max: ZaloAccountFriendMaxAggregateOutputType | null
  }

  type GetZaloAccountFriendGroupByPayload<T extends ZaloAccountFriendGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ZaloAccountFriendGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ZaloAccountFriendGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ZaloAccountFriendGroupByOutputType[P]>
            : GetScalarType<T[P], ZaloAccountFriendGroupByOutputType[P]>
        }
      >
    >


  export type ZaloAccountFriendSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    masterId?: boolean
    friendId?: boolean
    status?: boolean
    createdAt?: boolean
    master?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    friend?: boolean | ZaloAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["zaloAccountFriend"]>

  export type ZaloAccountFriendSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    masterId?: boolean
    friendId?: boolean
    status?: boolean
    createdAt?: boolean
    master?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    friend?: boolean | ZaloAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["zaloAccountFriend"]>

  export type ZaloAccountFriendSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    masterId?: boolean
    friendId?: boolean
    status?: boolean
    createdAt?: boolean
    master?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    friend?: boolean | ZaloAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["zaloAccountFriend"]>

  export type ZaloAccountFriendSelectScalar = {
    id?: boolean
    masterId?: boolean
    friendId?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type ZaloAccountFriendOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "masterId" | "friendId" | "status" | "createdAt", ExtArgs["result"]["zaloAccountFriend"]>
  export type ZaloAccountFriendInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    master?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    friend?: boolean | ZaloAccountDefaultArgs<ExtArgs>
  }
  export type ZaloAccountFriendIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    master?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    friend?: boolean | ZaloAccountDefaultArgs<ExtArgs>
  }
  export type ZaloAccountFriendIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    master?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    friend?: boolean | ZaloAccountDefaultArgs<ExtArgs>
  }

  export type $ZaloAccountFriendPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ZaloAccountFriend"
    objects: {
      master: Prisma.$ZaloAccountPayload<ExtArgs>
      friend: Prisma.$ZaloAccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      masterId: string
      friendId: string
      status: $Enums.ZaloAccountFriendStatus
      createdAt: Date
    }, ExtArgs["result"]["zaloAccountFriend"]>
    composites: {}
  }

  type ZaloAccountFriendGetPayload<S extends boolean | null | undefined | ZaloAccountFriendDefaultArgs> = $Result.GetResult<Prisma.$ZaloAccountFriendPayload, S>

  type ZaloAccountFriendCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ZaloAccountFriendFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ZaloAccountFriendCountAggregateInputType | true
    }

  export interface ZaloAccountFriendDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ZaloAccountFriend'], meta: { name: 'ZaloAccountFriend' } }
    /**
     * Find zero or one ZaloAccountFriend that matches the filter.
     * @param {ZaloAccountFriendFindUniqueArgs} args - Arguments to find a ZaloAccountFriend
     * @example
     * // Get one ZaloAccountFriend
     * const zaloAccountFriend = await prisma.zaloAccountFriend.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ZaloAccountFriendFindUniqueArgs>(args: SelectSubset<T, ZaloAccountFriendFindUniqueArgs<ExtArgs>>): Prisma__ZaloAccountFriendClient<$Result.GetResult<Prisma.$ZaloAccountFriendPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ZaloAccountFriend that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ZaloAccountFriendFindUniqueOrThrowArgs} args - Arguments to find a ZaloAccountFriend
     * @example
     * // Get one ZaloAccountFriend
     * const zaloAccountFriend = await prisma.zaloAccountFriend.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ZaloAccountFriendFindUniqueOrThrowArgs>(args: SelectSubset<T, ZaloAccountFriendFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ZaloAccountFriendClient<$Result.GetResult<Prisma.$ZaloAccountFriendPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ZaloAccountFriend that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountFriendFindFirstArgs} args - Arguments to find a ZaloAccountFriend
     * @example
     * // Get one ZaloAccountFriend
     * const zaloAccountFriend = await prisma.zaloAccountFriend.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ZaloAccountFriendFindFirstArgs>(args?: SelectSubset<T, ZaloAccountFriendFindFirstArgs<ExtArgs>>): Prisma__ZaloAccountFriendClient<$Result.GetResult<Prisma.$ZaloAccountFriendPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ZaloAccountFriend that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountFriendFindFirstOrThrowArgs} args - Arguments to find a ZaloAccountFriend
     * @example
     * // Get one ZaloAccountFriend
     * const zaloAccountFriend = await prisma.zaloAccountFriend.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ZaloAccountFriendFindFirstOrThrowArgs>(args?: SelectSubset<T, ZaloAccountFriendFindFirstOrThrowArgs<ExtArgs>>): Prisma__ZaloAccountFriendClient<$Result.GetResult<Prisma.$ZaloAccountFriendPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ZaloAccountFriends that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountFriendFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ZaloAccountFriends
     * const zaloAccountFriends = await prisma.zaloAccountFriend.findMany()
     * 
     * // Get first 10 ZaloAccountFriends
     * const zaloAccountFriends = await prisma.zaloAccountFriend.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const zaloAccountFriendWithIdOnly = await prisma.zaloAccountFriend.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ZaloAccountFriendFindManyArgs>(args?: SelectSubset<T, ZaloAccountFriendFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloAccountFriendPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ZaloAccountFriend.
     * @param {ZaloAccountFriendCreateArgs} args - Arguments to create a ZaloAccountFriend.
     * @example
     * // Create one ZaloAccountFriend
     * const ZaloAccountFriend = await prisma.zaloAccountFriend.create({
     *   data: {
     *     // ... data to create a ZaloAccountFriend
     *   }
     * })
     * 
     */
    create<T extends ZaloAccountFriendCreateArgs>(args: SelectSubset<T, ZaloAccountFriendCreateArgs<ExtArgs>>): Prisma__ZaloAccountFriendClient<$Result.GetResult<Prisma.$ZaloAccountFriendPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ZaloAccountFriends.
     * @param {ZaloAccountFriendCreateManyArgs} args - Arguments to create many ZaloAccountFriends.
     * @example
     * // Create many ZaloAccountFriends
     * const zaloAccountFriend = await prisma.zaloAccountFriend.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ZaloAccountFriendCreateManyArgs>(args?: SelectSubset<T, ZaloAccountFriendCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ZaloAccountFriends and returns the data saved in the database.
     * @param {ZaloAccountFriendCreateManyAndReturnArgs} args - Arguments to create many ZaloAccountFriends.
     * @example
     * // Create many ZaloAccountFriends
     * const zaloAccountFriend = await prisma.zaloAccountFriend.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ZaloAccountFriends and only return the `id`
     * const zaloAccountFriendWithIdOnly = await prisma.zaloAccountFriend.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ZaloAccountFriendCreateManyAndReturnArgs>(args?: SelectSubset<T, ZaloAccountFriendCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloAccountFriendPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ZaloAccountFriend.
     * @param {ZaloAccountFriendDeleteArgs} args - Arguments to delete one ZaloAccountFriend.
     * @example
     * // Delete one ZaloAccountFriend
     * const ZaloAccountFriend = await prisma.zaloAccountFriend.delete({
     *   where: {
     *     // ... filter to delete one ZaloAccountFriend
     *   }
     * })
     * 
     */
    delete<T extends ZaloAccountFriendDeleteArgs>(args: SelectSubset<T, ZaloAccountFriendDeleteArgs<ExtArgs>>): Prisma__ZaloAccountFriendClient<$Result.GetResult<Prisma.$ZaloAccountFriendPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ZaloAccountFriend.
     * @param {ZaloAccountFriendUpdateArgs} args - Arguments to update one ZaloAccountFriend.
     * @example
     * // Update one ZaloAccountFriend
     * const zaloAccountFriend = await prisma.zaloAccountFriend.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ZaloAccountFriendUpdateArgs>(args: SelectSubset<T, ZaloAccountFriendUpdateArgs<ExtArgs>>): Prisma__ZaloAccountFriendClient<$Result.GetResult<Prisma.$ZaloAccountFriendPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ZaloAccountFriends.
     * @param {ZaloAccountFriendDeleteManyArgs} args - Arguments to filter ZaloAccountFriends to delete.
     * @example
     * // Delete a few ZaloAccountFriends
     * const { count } = await prisma.zaloAccountFriend.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ZaloAccountFriendDeleteManyArgs>(args?: SelectSubset<T, ZaloAccountFriendDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ZaloAccountFriends.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountFriendUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ZaloAccountFriends
     * const zaloAccountFriend = await prisma.zaloAccountFriend.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ZaloAccountFriendUpdateManyArgs>(args: SelectSubset<T, ZaloAccountFriendUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ZaloAccountFriends and returns the data updated in the database.
     * @param {ZaloAccountFriendUpdateManyAndReturnArgs} args - Arguments to update many ZaloAccountFriends.
     * @example
     * // Update many ZaloAccountFriends
     * const zaloAccountFriend = await prisma.zaloAccountFriend.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ZaloAccountFriends and only return the `id`
     * const zaloAccountFriendWithIdOnly = await prisma.zaloAccountFriend.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ZaloAccountFriendUpdateManyAndReturnArgs>(args: SelectSubset<T, ZaloAccountFriendUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZaloAccountFriendPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ZaloAccountFriend.
     * @param {ZaloAccountFriendUpsertArgs} args - Arguments to update or create a ZaloAccountFriend.
     * @example
     * // Update or create a ZaloAccountFriend
     * const zaloAccountFriend = await prisma.zaloAccountFriend.upsert({
     *   create: {
     *     // ... data to create a ZaloAccountFriend
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ZaloAccountFriend we want to update
     *   }
     * })
     */
    upsert<T extends ZaloAccountFriendUpsertArgs>(args: SelectSubset<T, ZaloAccountFriendUpsertArgs<ExtArgs>>): Prisma__ZaloAccountFriendClient<$Result.GetResult<Prisma.$ZaloAccountFriendPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ZaloAccountFriends.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountFriendCountArgs} args - Arguments to filter ZaloAccountFriends to count.
     * @example
     * // Count the number of ZaloAccountFriends
     * const count = await prisma.zaloAccountFriend.count({
     *   where: {
     *     // ... the filter for the ZaloAccountFriends we want to count
     *   }
     * })
    **/
    count<T extends ZaloAccountFriendCountArgs>(
      args?: Subset<T, ZaloAccountFriendCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ZaloAccountFriendCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ZaloAccountFriend.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountFriendAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ZaloAccountFriendAggregateArgs>(args: Subset<T, ZaloAccountFriendAggregateArgs>): Prisma.PrismaPromise<GetZaloAccountFriendAggregateType<T>>

    /**
     * Group by ZaloAccountFriend.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZaloAccountFriendGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ZaloAccountFriendGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ZaloAccountFriendGroupByArgs['orderBy'] }
        : { orderBy?: ZaloAccountFriendGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ZaloAccountFriendGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetZaloAccountFriendGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ZaloAccountFriend model
   */
  readonly fields: ZaloAccountFriendFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ZaloAccountFriend.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ZaloAccountFriendClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    master<T extends ZaloAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ZaloAccountDefaultArgs<ExtArgs>>): Prisma__ZaloAccountClient<$Result.GetResult<Prisma.$ZaloAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    friend<T extends ZaloAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ZaloAccountDefaultArgs<ExtArgs>>): Prisma__ZaloAccountClient<$Result.GetResult<Prisma.$ZaloAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ZaloAccountFriend model
   */
  interface ZaloAccountFriendFieldRefs {
    readonly id: FieldRef<"ZaloAccountFriend", 'String'>
    readonly masterId: FieldRef<"ZaloAccountFriend", 'String'>
    readonly friendId: FieldRef<"ZaloAccountFriend", 'String'>
    readonly status: FieldRef<"ZaloAccountFriend", 'ZaloAccountFriendStatus'>
    readonly createdAt: FieldRef<"ZaloAccountFriend", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ZaloAccountFriend findUnique
   */
  export type ZaloAccountFriendFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountFriend
     */
    select?: ZaloAccountFriendSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountFriend
     */
    omit?: ZaloAccountFriendOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountFriendInclude<ExtArgs> | null
    /**
     * Filter, which ZaloAccountFriend to fetch.
     */
    where: ZaloAccountFriendWhereUniqueInput
  }

  /**
   * ZaloAccountFriend findUniqueOrThrow
   */
  export type ZaloAccountFriendFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountFriend
     */
    select?: ZaloAccountFriendSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountFriend
     */
    omit?: ZaloAccountFriendOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountFriendInclude<ExtArgs> | null
    /**
     * Filter, which ZaloAccountFriend to fetch.
     */
    where: ZaloAccountFriendWhereUniqueInput
  }

  /**
   * ZaloAccountFriend findFirst
   */
  export type ZaloAccountFriendFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountFriend
     */
    select?: ZaloAccountFriendSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountFriend
     */
    omit?: ZaloAccountFriendOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountFriendInclude<ExtArgs> | null
    /**
     * Filter, which ZaloAccountFriend to fetch.
     */
    where?: ZaloAccountFriendWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ZaloAccountFriends to fetch.
     */
    orderBy?: ZaloAccountFriendOrderByWithRelationInput | ZaloAccountFriendOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ZaloAccountFriends.
     */
    cursor?: ZaloAccountFriendWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ZaloAccountFriends from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ZaloAccountFriends.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ZaloAccountFriends.
     */
    distinct?: ZaloAccountFriendScalarFieldEnum | ZaloAccountFriendScalarFieldEnum[]
  }

  /**
   * ZaloAccountFriend findFirstOrThrow
   */
  export type ZaloAccountFriendFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountFriend
     */
    select?: ZaloAccountFriendSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountFriend
     */
    omit?: ZaloAccountFriendOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountFriendInclude<ExtArgs> | null
    /**
     * Filter, which ZaloAccountFriend to fetch.
     */
    where?: ZaloAccountFriendWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ZaloAccountFriends to fetch.
     */
    orderBy?: ZaloAccountFriendOrderByWithRelationInput | ZaloAccountFriendOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ZaloAccountFriends.
     */
    cursor?: ZaloAccountFriendWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ZaloAccountFriends from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ZaloAccountFriends.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ZaloAccountFriends.
     */
    distinct?: ZaloAccountFriendScalarFieldEnum | ZaloAccountFriendScalarFieldEnum[]
  }

  /**
   * ZaloAccountFriend findMany
   */
  export type ZaloAccountFriendFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountFriend
     */
    select?: ZaloAccountFriendSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountFriend
     */
    omit?: ZaloAccountFriendOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountFriendInclude<ExtArgs> | null
    /**
     * Filter, which ZaloAccountFriends to fetch.
     */
    where?: ZaloAccountFriendWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ZaloAccountFriends to fetch.
     */
    orderBy?: ZaloAccountFriendOrderByWithRelationInput | ZaloAccountFriendOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ZaloAccountFriends.
     */
    cursor?: ZaloAccountFriendWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ZaloAccountFriends from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ZaloAccountFriends.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ZaloAccountFriends.
     */
    distinct?: ZaloAccountFriendScalarFieldEnum | ZaloAccountFriendScalarFieldEnum[]
  }

  /**
   * ZaloAccountFriend create
   */
  export type ZaloAccountFriendCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountFriend
     */
    select?: ZaloAccountFriendSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountFriend
     */
    omit?: ZaloAccountFriendOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountFriendInclude<ExtArgs> | null
    /**
     * The data needed to create a ZaloAccountFriend.
     */
    data: XOR<ZaloAccountFriendCreateInput, ZaloAccountFriendUncheckedCreateInput>
  }

  /**
   * ZaloAccountFriend createMany
   */
  export type ZaloAccountFriendCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ZaloAccountFriends.
     */
    data: ZaloAccountFriendCreateManyInput | ZaloAccountFriendCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ZaloAccountFriend createManyAndReturn
   */
  export type ZaloAccountFriendCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountFriend
     */
    select?: ZaloAccountFriendSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountFriend
     */
    omit?: ZaloAccountFriendOmit<ExtArgs> | null
    /**
     * The data used to create many ZaloAccountFriends.
     */
    data: ZaloAccountFriendCreateManyInput | ZaloAccountFriendCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountFriendIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ZaloAccountFriend update
   */
  export type ZaloAccountFriendUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountFriend
     */
    select?: ZaloAccountFriendSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountFriend
     */
    omit?: ZaloAccountFriendOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountFriendInclude<ExtArgs> | null
    /**
     * The data needed to update a ZaloAccountFriend.
     */
    data: XOR<ZaloAccountFriendUpdateInput, ZaloAccountFriendUncheckedUpdateInput>
    /**
     * Choose, which ZaloAccountFriend to update.
     */
    where: ZaloAccountFriendWhereUniqueInput
  }

  /**
   * ZaloAccountFriend updateMany
   */
  export type ZaloAccountFriendUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ZaloAccountFriends.
     */
    data: XOR<ZaloAccountFriendUpdateManyMutationInput, ZaloAccountFriendUncheckedUpdateManyInput>
    /**
     * Filter which ZaloAccountFriends to update
     */
    where?: ZaloAccountFriendWhereInput
    /**
     * Limit how many ZaloAccountFriends to update.
     */
    limit?: number
  }

  /**
   * ZaloAccountFriend updateManyAndReturn
   */
  export type ZaloAccountFriendUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountFriend
     */
    select?: ZaloAccountFriendSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountFriend
     */
    omit?: ZaloAccountFriendOmit<ExtArgs> | null
    /**
     * The data used to update ZaloAccountFriends.
     */
    data: XOR<ZaloAccountFriendUpdateManyMutationInput, ZaloAccountFriendUncheckedUpdateManyInput>
    /**
     * Filter which ZaloAccountFriends to update
     */
    where?: ZaloAccountFriendWhereInput
    /**
     * Limit how many ZaloAccountFriends to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountFriendIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ZaloAccountFriend upsert
   */
  export type ZaloAccountFriendUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountFriend
     */
    select?: ZaloAccountFriendSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountFriend
     */
    omit?: ZaloAccountFriendOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountFriendInclude<ExtArgs> | null
    /**
     * The filter to search for the ZaloAccountFriend to update in case it exists.
     */
    where: ZaloAccountFriendWhereUniqueInput
    /**
     * In case the ZaloAccountFriend found by the `where` argument doesn't exist, create a new ZaloAccountFriend with this data.
     */
    create: XOR<ZaloAccountFriendCreateInput, ZaloAccountFriendUncheckedCreateInput>
    /**
     * In case the ZaloAccountFriend was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ZaloAccountFriendUpdateInput, ZaloAccountFriendUncheckedUpdateInput>
  }

  /**
   * ZaloAccountFriend delete
   */
  export type ZaloAccountFriendDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountFriend
     */
    select?: ZaloAccountFriendSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountFriend
     */
    omit?: ZaloAccountFriendOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountFriendInclude<ExtArgs> | null
    /**
     * Filter which ZaloAccountFriend to delete.
     */
    where: ZaloAccountFriendWhereUniqueInput
  }

  /**
   * ZaloAccountFriend deleteMany
   */
  export type ZaloAccountFriendDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ZaloAccountFriends to delete
     */
    where?: ZaloAccountFriendWhereInput
    /**
     * Limit how many ZaloAccountFriends to delete.
     */
    limit?: number
  }

  /**
   * ZaloAccountFriend without action
   */
  export type ZaloAccountFriendDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZaloAccountFriend
     */
    select?: ZaloAccountFriendSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ZaloAccountFriend
     */
    omit?: ZaloAccountFriendOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZaloAccountFriendInclude<ExtArgs> | null
  }


  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  export type MessageMinAggregateOutputType = {
    id: string | null
    messageZaloId: string | null
    cliMsgId: string | null
    uidFrom: string | null
    content: string | null
    senderId: string | null
    groupId: string | null
    sentAt: Date | null
    status: $Enums.MessageStatus | null
    createdAt: Date | null
  }

  export type MessageMaxAggregateOutputType = {
    id: string | null
    messageZaloId: string | null
    cliMsgId: string | null
    uidFrom: string | null
    content: string | null
    senderId: string | null
    groupId: string | null
    sentAt: Date | null
    status: $Enums.MessageStatus | null
    createdAt: Date | null
  }

  export type MessageCountAggregateOutputType = {
    id: number
    messageZaloId: number
    cliMsgId: number
    uidFrom: number
    content: number
    senderId: number
    groupId: number
    sentAt: number
    status: number
    createdAt: number
    _all: number
  }


  export type MessageMinAggregateInputType = {
    id?: true
    messageZaloId?: true
    cliMsgId?: true
    uidFrom?: true
    content?: true
    senderId?: true
    groupId?: true
    sentAt?: true
    status?: true
    createdAt?: true
  }

  export type MessageMaxAggregateInputType = {
    id?: true
    messageZaloId?: true
    cliMsgId?: true
    uidFrom?: true
    content?: true
    senderId?: true
    groupId?: true
    sentAt?: true
    status?: true
    createdAt?: true
  }

  export type MessageCountAggregateInputType = {
    id?: true
    messageZaloId?: true
    cliMsgId?: true
    uidFrom?: true
    content?: true
    senderId?: true
    groupId?: true
    sentAt?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type MessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Messages
    **/
    _count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }




  export type MessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithAggregationInput | MessageOrderByWithAggregationInput[]
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum
    having?: MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageCountAggregateInputType | true
    _min?: MessageMinAggregateInputType
    _max?: MessageMaxAggregateInputType
  }

  export type MessageGroupByOutputType = {
    id: string
    messageZaloId: string | null
    cliMsgId: string | null
    uidFrom: string | null
    content: string
    senderId: string
    groupId: string
    sentAt: Date | null
    status: $Enums.MessageStatus
    createdAt: Date
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>
        }
      >
    >


  export type MessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    messageZaloId?: boolean
    cliMsgId?: boolean
    uidFrom?: boolean
    content?: boolean
    senderId?: boolean
    groupId?: boolean
    sentAt?: boolean
    status?: boolean
    createdAt?: boolean
    sender?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    group?: boolean | ZaloGroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    messageZaloId?: boolean
    cliMsgId?: boolean
    uidFrom?: boolean
    content?: boolean
    senderId?: boolean
    groupId?: boolean
    sentAt?: boolean
    status?: boolean
    createdAt?: boolean
    sender?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    group?: boolean | ZaloGroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    messageZaloId?: boolean
    cliMsgId?: boolean
    uidFrom?: boolean
    content?: boolean
    senderId?: boolean
    groupId?: boolean
    sentAt?: boolean
    status?: boolean
    createdAt?: boolean
    sender?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    group?: boolean | ZaloGroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectScalar = {
    id?: boolean
    messageZaloId?: boolean
    cliMsgId?: boolean
    uidFrom?: boolean
    content?: boolean
    senderId?: boolean
    groupId?: boolean
    sentAt?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type MessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "messageZaloId" | "cliMsgId" | "uidFrom" | "content" | "senderId" | "groupId" | "sentAt" | "status" | "createdAt", ExtArgs["result"]["message"]>
  export type MessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    group?: boolean | ZaloGroupDefaultArgs<ExtArgs>
  }
  export type MessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    group?: boolean | ZaloGroupDefaultArgs<ExtArgs>
  }
  export type MessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | ZaloAccountDefaultArgs<ExtArgs>
    group?: boolean | ZaloGroupDefaultArgs<ExtArgs>
  }

  export type $MessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Message"
    objects: {
      sender: Prisma.$ZaloAccountPayload<ExtArgs>
      group: Prisma.$ZaloGroupPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      messageZaloId: string | null
      cliMsgId: string | null
      uidFrom: string | null
      content: string
      senderId: string
      groupId: string
      sentAt: Date | null
      status: $Enums.MessageStatus
      createdAt: Date
    }, ExtArgs["result"]["message"]>
    composites: {}
  }

  type MessageGetPayload<S extends boolean | null | undefined | MessageDefaultArgs> = $Result.GetResult<Prisma.$MessagePayload, S>

  type MessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessageCountAggregateInputType | true
    }

  export interface MessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Message'], meta: { name: 'Message' } }
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageFindUniqueArgs>(args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageFindFirstArgs>(args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageFindManyArgs>(args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
     */
    create<T extends MessageCreateArgs>(args: SelectSubset<T, MessageCreateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageCreateManyArgs>(args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {MessageCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MessageCreateManyAndReturnArgs>(args?: SelectSubset<T, MessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
     */
    delete<T extends MessageDeleteArgs>(args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageUpdateArgs>(args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageDeleteManyArgs>(args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageUpdateManyArgs>(args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages and returns the data updated in the database.
     * @param {MessageUpdateManyAndReturnArgs} args - Arguments to update many Messages.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MessageUpdateManyAndReturnArgs>(args: SelectSubset<T, MessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
     */
    upsert<T extends MessageUpsertArgs>(args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Message model
   */
  readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sender<T extends ZaloAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ZaloAccountDefaultArgs<ExtArgs>>): Prisma__ZaloAccountClient<$Result.GetResult<Prisma.$ZaloAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    group<T extends ZaloGroupDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ZaloGroupDefaultArgs<ExtArgs>>): Prisma__ZaloGroupClient<$Result.GetResult<Prisma.$ZaloGroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Message model
   */
  interface MessageFieldRefs {
    readonly id: FieldRef<"Message", 'String'>
    readonly messageZaloId: FieldRef<"Message", 'String'>
    readonly cliMsgId: FieldRef<"Message", 'String'>
    readonly uidFrom: FieldRef<"Message", 'String'>
    readonly content: FieldRef<"Message", 'String'>
    readonly senderId: FieldRef<"Message", 'String'>
    readonly groupId: FieldRef<"Message", 'String'>
    readonly sentAt: FieldRef<"Message", 'DateTime'>
    readonly status: FieldRef<"Message", 'MessageStatus'>
    readonly createdAt: FieldRef<"Message", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message create
   */
  export type MessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>
  }

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Message createManyAndReturn
   */
  export type MessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message update
   */
  export type MessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
  }

  /**
   * Message updateManyAndReturn
   */
  export type MessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
  }

  /**
   * Message delete
   */
  export type MessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to delete.
     */
    limit?: number
  }

  /**
   * Message without action
   */
  export type MessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
  }


  /**
   * Model ApiKey
   */

  export type AggregateApiKey = {
    _count: ApiKeyCountAggregateOutputType | null
    _min: ApiKeyMinAggregateOutputType | null
    _max: ApiKeyMaxAggregateOutputType | null
  }

  export type ApiKeyMinAggregateOutputType = {
    id: string | null
    name: string | null
    secretKey: string | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type ApiKeyMaxAggregateOutputType = {
    id: string | null
    name: string | null
    secretKey: string | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type ApiKeyCountAggregateOutputType = {
    id: number
    name: number
    secretKey: number
    isActive: number
    createdAt: number
    _all: number
  }


  export type ApiKeyMinAggregateInputType = {
    id?: true
    name?: true
    secretKey?: true
    isActive?: true
    createdAt?: true
  }

  export type ApiKeyMaxAggregateInputType = {
    id?: true
    name?: true
    secretKey?: true
    isActive?: true
    createdAt?: true
  }

  export type ApiKeyCountAggregateInputType = {
    id?: true
    name?: true
    secretKey?: true
    isActive?: true
    createdAt?: true
    _all?: true
  }

  export type ApiKeyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiKey to aggregate.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ApiKeys
    **/
    _count?: true | ApiKeyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApiKeyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApiKeyMaxAggregateInputType
  }

  export type GetApiKeyAggregateType<T extends ApiKeyAggregateArgs> = {
        [P in keyof T & keyof AggregateApiKey]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApiKey[P]>
      : GetScalarType<T[P], AggregateApiKey[P]>
  }




  export type ApiKeyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiKeyWhereInput
    orderBy?: ApiKeyOrderByWithAggregationInput | ApiKeyOrderByWithAggregationInput[]
    by: ApiKeyScalarFieldEnum[] | ApiKeyScalarFieldEnum
    having?: ApiKeyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApiKeyCountAggregateInputType | true
    _min?: ApiKeyMinAggregateInputType
    _max?: ApiKeyMaxAggregateInputType
  }

  export type ApiKeyGroupByOutputType = {
    id: string
    name: string
    secretKey: string
    isActive: boolean
    createdAt: Date
    _count: ApiKeyCountAggregateOutputType | null
    _min: ApiKeyMinAggregateOutputType | null
    _max: ApiKeyMaxAggregateOutputType | null
  }

  type GetApiKeyGroupByPayload<T extends ApiKeyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApiKeyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApiKeyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApiKeyGroupByOutputType[P]>
            : GetScalarType<T[P], ApiKeyGroupByOutputType[P]>
        }
      >
    >


  export type ApiKeySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    secretKey?: boolean
    isActive?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["apiKey"]>

  export type ApiKeySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    secretKey?: boolean
    isActive?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["apiKey"]>

  export type ApiKeySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    secretKey?: boolean
    isActive?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["apiKey"]>

  export type ApiKeySelectScalar = {
    id?: boolean
    name?: boolean
    secretKey?: boolean
    isActive?: boolean
    createdAt?: boolean
  }

  export type ApiKeyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "secretKey" | "isActive" | "createdAt", ExtArgs["result"]["apiKey"]>

  export type $ApiKeyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ApiKey"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      secretKey: string
      isActive: boolean
      createdAt: Date
    }, ExtArgs["result"]["apiKey"]>
    composites: {}
  }

  type ApiKeyGetPayload<S extends boolean | null | undefined | ApiKeyDefaultArgs> = $Result.GetResult<Prisma.$ApiKeyPayload, S>

  type ApiKeyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ApiKeyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ApiKeyCountAggregateInputType | true
    }

  export interface ApiKeyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ApiKey'], meta: { name: 'ApiKey' } }
    /**
     * Find zero or one ApiKey that matches the filter.
     * @param {ApiKeyFindUniqueArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApiKeyFindUniqueArgs>(args: SelectSubset<T, ApiKeyFindUniqueArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ApiKey that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApiKeyFindUniqueOrThrowArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApiKeyFindUniqueOrThrowArgs>(args: SelectSubset<T, ApiKeyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiKey that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindFirstArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApiKeyFindFirstArgs>(args?: SelectSubset<T, ApiKeyFindFirstArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiKey that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindFirstOrThrowArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApiKeyFindFirstOrThrowArgs>(args?: SelectSubset<T, ApiKeyFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ApiKeys that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ApiKeys
     * const apiKeys = await prisma.apiKey.findMany()
     * 
     * // Get first 10 ApiKeys
     * const apiKeys = await prisma.apiKey.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const apiKeyWithIdOnly = await prisma.apiKey.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ApiKeyFindManyArgs>(args?: SelectSubset<T, ApiKeyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ApiKey.
     * @param {ApiKeyCreateArgs} args - Arguments to create a ApiKey.
     * @example
     * // Create one ApiKey
     * const ApiKey = await prisma.apiKey.create({
     *   data: {
     *     // ... data to create a ApiKey
     *   }
     * })
     * 
     */
    create<T extends ApiKeyCreateArgs>(args: SelectSubset<T, ApiKeyCreateArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ApiKeys.
     * @param {ApiKeyCreateManyArgs} args - Arguments to create many ApiKeys.
     * @example
     * // Create many ApiKeys
     * const apiKey = await prisma.apiKey.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApiKeyCreateManyArgs>(args?: SelectSubset<T, ApiKeyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ApiKeys and returns the data saved in the database.
     * @param {ApiKeyCreateManyAndReturnArgs} args - Arguments to create many ApiKeys.
     * @example
     * // Create many ApiKeys
     * const apiKey = await prisma.apiKey.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ApiKeys and only return the `id`
     * const apiKeyWithIdOnly = await prisma.apiKey.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ApiKeyCreateManyAndReturnArgs>(args?: SelectSubset<T, ApiKeyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ApiKey.
     * @param {ApiKeyDeleteArgs} args - Arguments to delete one ApiKey.
     * @example
     * // Delete one ApiKey
     * const ApiKey = await prisma.apiKey.delete({
     *   where: {
     *     // ... filter to delete one ApiKey
     *   }
     * })
     * 
     */
    delete<T extends ApiKeyDeleteArgs>(args: SelectSubset<T, ApiKeyDeleteArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ApiKey.
     * @param {ApiKeyUpdateArgs} args - Arguments to update one ApiKey.
     * @example
     * // Update one ApiKey
     * const apiKey = await prisma.apiKey.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApiKeyUpdateArgs>(args: SelectSubset<T, ApiKeyUpdateArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ApiKeys.
     * @param {ApiKeyDeleteManyArgs} args - Arguments to filter ApiKeys to delete.
     * @example
     * // Delete a few ApiKeys
     * const { count } = await prisma.apiKey.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApiKeyDeleteManyArgs>(args?: SelectSubset<T, ApiKeyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ApiKeys
     * const apiKey = await prisma.apiKey.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApiKeyUpdateManyArgs>(args: SelectSubset<T, ApiKeyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiKeys and returns the data updated in the database.
     * @param {ApiKeyUpdateManyAndReturnArgs} args - Arguments to update many ApiKeys.
     * @example
     * // Update many ApiKeys
     * const apiKey = await prisma.apiKey.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ApiKeys and only return the `id`
     * const apiKeyWithIdOnly = await prisma.apiKey.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ApiKeyUpdateManyAndReturnArgs>(args: SelectSubset<T, ApiKeyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ApiKey.
     * @param {ApiKeyUpsertArgs} args - Arguments to update or create a ApiKey.
     * @example
     * // Update or create a ApiKey
     * const apiKey = await prisma.apiKey.upsert({
     *   create: {
     *     // ... data to create a ApiKey
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ApiKey we want to update
     *   }
     * })
     */
    upsert<T extends ApiKeyUpsertArgs>(args: SelectSubset<T, ApiKeyUpsertArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ApiKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyCountArgs} args - Arguments to filter ApiKeys to count.
     * @example
     * // Count the number of ApiKeys
     * const count = await prisma.apiKey.count({
     *   where: {
     *     // ... the filter for the ApiKeys we want to count
     *   }
     * })
    **/
    count<T extends ApiKeyCountArgs>(
      args?: Subset<T, ApiKeyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApiKeyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ApiKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ApiKeyAggregateArgs>(args: Subset<T, ApiKeyAggregateArgs>): Prisma.PrismaPromise<GetApiKeyAggregateType<T>>

    /**
     * Group by ApiKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ApiKeyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApiKeyGroupByArgs['orderBy'] }
        : { orderBy?: ApiKeyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ApiKeyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApiKeyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ApiKey model
   */
  readonly fields: ApiKeyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ApiKey.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApiKeyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ApiKey model
   */
  interface ApiKeyFieldRefs {
    readonly id: FieldRef<"ApiKey", 'String'>
    readonly name: FieldRef<"ApiKey", 'String'>
    readonly secretKey: FieldRef<"ApiKey", 'String'>
    readonly isActive: FieldRef<"ApiKey", 'Boolean'>
    readonly createdAt: FieldRef<"ApiKey", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ApiKey findUnique
   */
  export type ApiKeyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey findUniqueOrThrow
   */
  export type ApiKeyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey findFirst
   */
  export type ApiKeyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiKeys.
     */
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey findFirstOrThrow
   */
  export type ApiKeyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiKeys.
     */
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey findMany
   */
  export type ApiKeyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Filter, which ApiKeys to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiKeys.
     */
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey create
   */
  export type ApiKeyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * The data needed to create a ApiKey.
     */
    data: XOR<ApiKeyCreateInput, ApiKeyUncheckedCreateInput>
  }

  /**
   * ApiKey createMany
   */
  export type ApiKeyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ApiKeys.
     */
    data: ApiKeyCreateManyInput | ApiKeyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ApiKey createManyAndReturn
   */
  export type ApiKeyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * The data used to create many ApiKeys.
     */
    data: ApiKeyCreateManyInput | ApiKeyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ApiKey update
   */
  export type ApiKeyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * The data needed to update a ApiKey.
     */
    data: XOR<ApiKeyUpdateInput, ApiKeyUncheckedUpdateInput>
    /**
     * Choose, which ApiKey to update.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey updateMany
   */
  export type ApiKeyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ApiKeys.
     */
    data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyInput>
    /**
     * Filter which ApiKeys to update
     */
    where?: ApiKeyWhereInput
    /**
     * Limit how many ApiKeys to update.
     */
    limit?: number
  }

  /**
   * ApiKey updateManyAndReturn
   */
  export type ApiKeyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * The data used to update ApiKeys.
     */
    data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyInput>
    /**
     * Filter which ApiKeys to update
     */
    where?: ApiKeyWhereInput
    /**
     * Limit how many ApiKeys to update.
     */
    limit?: number
  }

  /**
   * ApiKey upsert
   */
  export type ApiKeyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * The filter to search for the ApiKey to update in case it exists.
     */
    where: ApiKeyWhereUniqueInput
    /**
     * In case the ApiKey found by the `where` argument doesn't exist, create a new ApiKey with this data.
     */
    create: XOR<ApiKeyCreateInput, ApiKeyUncheckedCreateInput>
    /**
     * In case the ApiKey was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApiKeyUpdateInput, ApiKeyUncheckedUpdateInput>
  }

  /**
   * ApiKey delete
   */
  export type ApiKeyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Filter which ApiKey to delete.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey deleteMany
   */
  export type ApiKeyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiKeys to delete
     */
    where?: ApiKeyWhereInput
    /**
     * Limit how many ApiKeys to delete.
     */
    limit?: number
  }

  /**
   * ApiKey without action
   */
  export type ApiKeyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
  }


  /**
   * Model Configuration
   */

  export type AggregateConfiguration = {
    _count: ConfigurationCountAggregateOutputType | null
    _min: ConfigurationMinAggregateOutputType | null
    _max: ConfigurationMaxAggregateOutputType | null
  }

  export type ConfigurationMinAggregateOutputType = {
    id: string | null
    key: string | null
    value: string | null
    updatedAt: Date | null
  }

  export type ConfigurationMaxAggregateOutputType = {
    id: string | null
    key: string | null
    value: string | null
    updatedAt: Date | null
  }

  export type ConfigurationCountAggregateOutputType = {
    id: number
    key: number
    value: number
    updatedAt: number
    _all: number
  }


  export type ConfigurationMinAggregateInputType = {
    id?: true
    key?: true
    value?: true
    updatedAt?: true
  }

  export type ConfigurationMaxAggregateInputType = {
    id?: true
    key?: true
    value?: true
    updatedAt?: true
  }

  export type ConfigurationCountAggregateInputType = {
    id?: true
    key?: true
    value?: true
    updatedAt?: true
    _all?: true
  }

  export type ConfigurationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Configuration to aggregate.
     */
    where?: ConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Configurations to fetch.
     */
    orderBy?: ConfigurationOrderByWithRelationInput | ConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Configurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Configurations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Configurations
    **/
    _count?: true | ConfigurationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConfigurationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConfigurationMaxAggregateInputType
  }

  export type GetConfigurationAggregateType<T extends ConfigurationAggregateArgs> = {
        [P in keyof T & keyof AggregateConfiguration]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConfiguration[P]>
      : GetScalarType<T[P], AggregateConfiguration[P]>
  }




  export type ConfigurationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConfigurationWhereInput
    orderBy?: ConfigurationOrderByWithAggregationInput | ConfigurationOrderByWithAggregationInput[]
    by: ConfigurationScalarFieldEnum[] | ConfigurationScalarFieldEnum
    having?: ConfigurationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConfigurationCountAggregateInputType | true
    _min?: ConfigurationMinAggregateInputType
    _max?: ConfigurationMaxAggregateInputType
  }

  export type ConfigurationGroupByOutputType = {
    id: string
    key: string
    value: string
    updatedAt: Date
    _count: ConfigurationCountAggregateOutputType | null
    _min: ConfigurationMinAggregateOutputType | null
    _max: ConfigurationMaxAggregateOutputType | null
  }

  type GetConfigurationGroupByPayload<T extends ConfigurationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConfigurationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConfigurationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConfigurationGroupByOutputType[P]>
            : GetScalarType<T[P], ConfigurationGroupByOutputType[P]>
        }
      >
    >


  export type ConfigurationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["configuration"]>

  export type ConfigurationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["configuration"]>

  export type ConfigurationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["configuration"]>

  export type ConfigurationSelectScalar = {
    id?: boolean
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }

  export type ConfigurationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "key" | "value" | "updatedAt", ExtArgs["result"]["configuration"]>

  export type $ConfigurationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Configuration"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      key: string
      value: string
      updatedAt: Date
    }, ExtArgs["result"]["configuration"]>
    composites: {}
  }

  type ConfigurationGetPayload<S extends boolean | null | undefined | ConfigurationDefaultArgs> = $Result.GetResult<Prisma.$ConfigurationPayload, S>

  type ConfigurationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConfigurationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConfigurationCountAggregateInputType | true
    }

  export interface ConfigurationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Configuration'], meta: { name: 'Configuration' } }
    /**
     * Find zero or one Configuration that matches the filter.
     * @param {ConfigurationFindUniqueArgs} args - Arguments to find a Configuration
     * @example
     * // Get one Configuration
     * const configuration = await prisma.configuration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConfigurationFindUniqueArgs>(args: SelectSubset<T, ConfigurationFindUniqueArgs<ExtArgs>>): Prisma__ConfigurationClient<$Result.GetResult<Prisma.$ConfigurationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Configuration that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConfigurationFindUniqueOrThrowArgs} args - Arguments to find a Configuration
     * @example
     * // Get one Configuration
     * const configuration = await prisma.configuration.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConfigurationFindUniqueOrThrowArgs>(args: SelectSubset<T, ConfigurationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConfigurationClient<$Result.GetResult<Prisma.$ConfigurationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Configuration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfigurationFindFirstArgs} args - Arguments to find a Configuration
     * @example
     * // Get one Configuration
     * const configuration = await prisma.configuration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConfigurationFindFirstArgs>(args?: SelectSubset<T, ConfigurationFindFirstArgs<ExtArgs>>): Prisma__ConfigurationClient<$Result.GetResult<Prisma.$ConfigurationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Configuration that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfigurationFindFirstOrThrowArgs} args - Arguments to find a Configuration
     * @example
     * // Get one Configuration
     * const configuration = await prisma.configuration.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConfigurationFindFirstOrThrowArgs>(args?: SelectSubset<T, ConfigurationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConfigurationClient<$Result.GetResult<Prisma.$ConfigurationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Configurations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfigurationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Configurations
     * const configurations = await prisma.configuration.findMany()
     * 
     * // Get first 10 Configurations
     * const configurations = await prisma.configuration.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const configurationWithIdOnly = await prisma.configuration.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConfigurationFindManyArgs>(args?: SelectSubset<T, ConfigurationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfigurationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Configuration.
     * @param {ConfigurationCreateArgs} args - Arguments to create a Configuration.
     * @example
     * // Create one Configuration
     * const Configuration = await prisma.configuration.create({
     *   data: {
     *     // ... data to create a Configuration
     *   }
     * })
     * 
     */
    create<T extends ConfigurationCreateArgs>(args: SelectSubset<T, ConfigurationCreateArgs<ExtArgs>>): Prisma__ConfigurationClient<$Result.GetResult<Prisma.$ConfigurationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Configurations.
     * @param {ConfigurationCreateManyArgs} args - Arguments to create many Configurations.
     * @example
     * // Create many Configurations
     * const configuration = await prisma.configuration.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConfigurationCreateManyArgs>(args?: SelectSubset<T, ConfigurationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Configurations and returns the data saved in the database.
     * @param {ConfigurationCreateManyAndReturnArgs} args - Arguments to create many Configurations.
     * @example
     * // Create many Configurations
     * const configuration = await prisma.configuration.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Configurations and only return the `id`
     * const configurationWithIdOnly = await prisma.configuration.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConfigurationCreateManyAndReturnArgs>(args?: SelectSubset<T, ConfigurationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfigurationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Configuration.
     * @param {ConfigurationDeleteArgs} args - Arguments to delete one Configuration.
     * @example
     * // Delete one Configuration
     * const Configuration = await prisma.configuration.delete({
     *   where: {
     *     // ... filter to delete one Configuration
     *   }
     * })
     * 
     */
    delete<T extends ConfigurationDeleteArgs>(args: SelectSubset<T, ConfigurationDeleteArgs<ExtArgs>>): Prisma__ConfigurationClient<$Result.GetResult<Prisma.$ConfigurationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Configuration.
     * @param {ConfigurationUpdateArgs} args - Arguments to update one Configuration.
     * @example
     * // Update one Configuration
     * const configuration = await prisma.configuration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConfigurationUpdateArgs>(args: SelectSubset<T, ConfigurationUpdateArgs<ExtArgs>>): Prisma__ConfigurationClient<$Result.GetResult<Prisma.$ConfigurationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Configurations.
     * @param {ConfigurationDeleteManyArgs} args - Arguments to filter Configurations to delete.
     * @example
     * // Delete a few Configurations
     * const { count } = await prisma.configuration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConfigurationDeleteManyArgs>(args?: SelectSubset<T, ConfigurationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Configurations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfigurationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Configurations
     * const configuration = await prisma.configuration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConfigurationUpdateManyArgs>(args: SelectSubset<T, ConfigurationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Configurations and returns the data updated in the database.
     * @param {ConfigurationUpdateManyAndReturnArgs} args - Arguments to update many Configurations.
     * @example
     * // Update many Configurations
     * const configuration = await prisma.configuration.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Configurations and only return the `id`
     * const configurationWithIdOnly = await prisma.configuration.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ConfigurationUpdateManyAndReturnArgs>(args: SelectSubset<T, ConfigurationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfigurationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Configuration.
     * @param {ConfigurationUpsertArgs} args - Arguments to update or create a Configuration.
     * @example
     * // Update or create a Configuration
     * const configuration = await prisma.configuration.upsert({
     *   create: {
     *     // ... data to create a Configuration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Configuration we want to update
     *   }
     * })
     */
    upsert<T extends ConfigurationUpsertArgs>(args: SelectSubset<T, ConfigurationUpsertArgs<ExtArgs>>): Prisma__ConfigurationClient<$Result.GetResult<Prisma.$ConfigurationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Configurations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfigurationCountArgs} args - Arguments to filter Configurations to count.
     * @example
     * // Count the number of Configurations
     * const count = await prisma.configuration.count({
     *   where: {
     *     // ... the filter for the Configurations we want to count
     *   }
     * })
    **/
    count<T extends ConfigurationCountArgs>(
      args?: Subset<T, ConfigurationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConfigurationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Configuration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfigurationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConfigurationAggregateArgs>(args: Subset<T, ConfigurationAggregateArgs>): Prisma.PrismaPromise<GetConfigurationAggregateType<T>>

    /**
     * Group by Configuration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfigurationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConfigurationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConfigurationGroupByArgs['orderBy'] }
        : { orderBy?: ConfigurationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConfigurationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConfigurationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Configuration model
   */
  readonly fields: ConfigurationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Configuration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConfigurationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Configuration model
   */
  interface ConfigurationFieldRefs {
    readonly id: FieldRef<"Configuration", 'String'>
    readonly key: FieldRef<"Configuration", 'String'>
    readonly value: FieldRef<"Configuration", 'String'>
    readonly updatedAt: FieldRef<"Configuration", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Configuration findUnique
   */
  export type ConfigurationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuration
     */
    select?: ConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Configuration
     */
    omit?: ConfigurationOmit<ExtArgs> | null
    /**
     * Filter, which Configuration to fetch.
     */
    where: ConfigurationWhereUniqueInput
  }

  /**
   * Configuration findUniqueOrThrow
   */
  export type ConfigurationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuration
     */
    select?: ConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Configuration
     */
    omit?: ConfigurationOmit<ExtArgs> | null
    /**
     * Filter, which Configuration to fetch.
     */
    where: ConfigurationWhereUniqueInput
  }

  /**
   * Configuration findFirst
   */
  export type ConfigurationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuration
     */
    select?: ConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Configuration
     */
    omit?: ConfigurationOmit<ExtArgs> | null
    /**
     * Filter, which Configuration to fetch.
     */
    where?: ConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Configurations to fetch.
     */
    orderBy?: ConfigurationOrderByWithRelationInput | ConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Configurations.
     */
    cursor?: ConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Configurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Configurations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Configurations.
     */
    distinct?: ConfigurationScalarFieldEnum | ConfigurationScalarFieldEnum[]
  }

  /**
   * Configuration findFirstOrThrow
   */
  export type ConfigurationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuration
     */
    select?: ConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Configuration
     */
    omit?: ConfigurationOmit<ExtArgs> | null
    /**
     * Filter, which Configuration to fetch.
     */
    where?: ConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Configurations to fetch.
     */
    orderBy?: ConfigurationOrderByWithRelationInput | ConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Configurations.
     */
    cursor?: ConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Configurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Configurations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Configurations.
     */
    distinct?: ConfigurationScalarFieldEnum | ConfigurationScalarFieldEnum[]
  }

  /**
   * Configuration findMany
   */
  export type ConfigurationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuration
     */
    select?: ConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Configuration
     */
    omit?: ConfigurationOmit<ExtArgs> | null
    /**
     * Filter, which Configurations to fetch.
     */
    where?: ConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Configurations to fetch.
     */
    orderBy?: ConfigurationOrderByWithRelationInput | ConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Configurations.
     */
    cursor?: ConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Configurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Configurations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Configurations.
     */
    distinct?: ConfigurationScalarFieldEnum | ConfigurationScalarFieldEnum[]
  }

  /**
   * Configuration create
   */
  export type ConfigurationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuration
     */
    select?: ConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Configuration
     */
    omit?: ConfigurationOmit<ExtArgs> | null
    /**
     * The data needed to create a Configuration.
     */
    data: XOR<ConfigurationCreateInput, ConfigurationUncheckedCreateInput>
  }

  /**
   * Configuration createMany
   */
  export type ConfigurationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Configurations.
     */
    data: ConfigurationCreateManyInput | ConfigurationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Configuration createManyAndReturn
   */
  export type ConfigurationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuration
     */
    select?: ConfigurationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Configuration
     */
    omit?: ConfigurationOmit<ExtArgs> | null
    /**
     * The data used to create many Configurations.
     */
    data: ConfigurationCreateManyInput | ConfigurationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Configuration update
   */
  export type ConfigurationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuration
     */
    select?: ConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Configuration
     */
    omit?: ConfigurationOmit<ExtArgs> | null
    /**
     * The data needed to update a Configuration.
     */
    data: XOR<ConfigurationUpdateInput, ConfigurationUncheckedUpdateInput>
    /**
     * Choose, which Configuration to update.
     */
    where: ConfigurationWhereUniqueInput
  }

  /**
   * Configuration updateMany
   */
  export type ConfigurationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Configurations.
     */
    data: XOR<ConfigurationUpdateManyMutationInput, ConfigurationUncheckedUpdateManyInput>
    /**
     * Filter which Configurations to update
     */
    where?: ConfigurationWhereInput
    /**
     * Limit how many Configurations to update.
     */
    limit?: number
  }

  /**
   * Configuration updateManyAndReturn
   */
  export type ConfigurationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuration
     */
    select?: ConfigurationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Configuration
     */
    omit?: ConfigurationOmit<ExtArgs> | null
    /**
     * The data used to update Configurations.
     */
    data: XOR<ConfigurationUpdateManyMutationInput, ConfigurationUncheckedUpdateManyInput>
    /**
     * Filter which Configurations to update
     */
    where?: ConfigurationWhereInput
    /**
     * Limit how many Configurations to update.
     */
    limit?: number
  }

  /**
   * Configuration upsert
   */
  export type ConfigurationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuration
     */
    select?: ConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Configuration
     */
    omit?: ConfigurationOmit<ExtArgs> | null
    /**
     * The filter to search for the Configuration to update in case it exists.
     */
    where: ConfigurationWhereUniqueInput
    /**
     * In case the Configuration found by the `where` argument doesn't exist, create a new Configuration with this data.
     */
    create: XOR<ConfigurationCreateInput, ConfigurationUncheckedCreateInput>
    /**
     * In case the Configuration was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConfigurationUpdateInput, ConfigurationUncheckedUpdateInput>
  }

  /**
   * Configuration delete
   */
  export type ConfigurationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuration
     */
    select?: ConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Configuration
     */
    omit?: ConfigurationOmit<ExtArgs> | null
    /**
     * Filter which Configuration to delete.
     */
    where: ConfigurationWhereUniqueInput
  }

  /**
   * Configuration deleteMany
   */
  export type ConfigurationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Configurations to delete
     */
    where?: ConfigurationWhereInput
    /**
     * Limit how many Configurations to delete.
     */
    limit?: number
  }

  /**
   * Configuration without action
   */
  export type ConfigurationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Configuration
     */
    select?: ConfigurationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Configuration
     */
    omit?: ConfigurationOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    role: 'role',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ZaloGroupScalarFieldEnum: {
    id: 'id',
    groupName: 'groupName',
    isUpdateName: 'isUpdateName',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ZaloGroupScalarFieldEnum = (typeof ZaloGroupScalarFieldEnum)[keyof typeof ZaloGroupScalarFieldEnum]


  export const ZaloAccountRelationScalarFieldEnum: {
    id: 'id',
    masterId: 'masterId',
    childId: 'childId',
    createdAt: 'createdAt'
  };

  export type ZaloAccountRelationScalarFieldEnum = (typeof ZaloAccountRelationScalarFieldEnum)[keyof typeof ZaloAccountRelationScalarFieldEnum]


  export const ZaloAccountScalarFieldEnum: {
    id: 'id',
    zaloId: 'zaloId',
    phone: 'phone',
    name: 'name',
    isMaster: 'isMaster',
    groupCount: 'groupCount',
    groupData: 'groupData',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ZaloAccountScalarFieldEnum = (typeof ZaloAccountScalarFieldEnum)[keyof typeof ZaloAccountScalarFieldEnum]


  export const ZaloAccountGroupScalarFieldEnum: {
    id: 'id',
    groupZaloId: 'groupZaloId',
    zaloAccountId: 'zaloAccountId',
    groupId: 'groupId',
    joinedAt: 'joinedAt'
  };

  export type ZaloAccountGroupScalarFieldEnum = (typeof ZaloAccountGroupScalarFieldEnum)[keyof typeof ZaloAccountGroupScalarFieldEnum]


  export const ZaloAccountFriendScalarFieldEnum: {
    id: 'id',
    masterId: 'masterId',
    friendId: 'friendId',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type ZaloAccountFriendScalarFieldEnum = (typeof ZaloAccountFriendScalarFieldEnum)[keyof typeof ZaloAccountFriendScalarFieldEnum]


  export const MessageScalarFieldEnum: {
    id: 'id',
    messageZaloId: 'messageZaloId',
    cliMsgId: 'cliMsgId',
    uidFrom: 'uidFrom',
    content: 'content',
    senderId: 'senderId',
    groupId: 'groupId',
    sentAt: 'sentAt',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


  export const ApiKeyScalarFieldEnum: {
    id: 'id',
    name: 'name',
    secretKey: 'secretKey',
    isActive: 'isActive',
    createdAt: 'createdAt'
  };

  export type ApiKeyScalarFieldEnum = (typeof ApiKeyScalarFieldEnum)[keyof typeof ApiKeyScalarFieldEnum]


  export const ConfigurationScalarFieldEnum: {
    id: 'id',
    key: 'key',
    value: 'value',
    updatedAt: 'updatedAt'
  };

  export type ConfigurationScalarFieldEnum = (typeof ConfigurationScalarFieldEnum)[keyof typeof ConfigurationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'ZaloAccountFriendStatus'
   */
  export type EnumZaloAccountFriendStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ZaloAccountFriendStatus'>
    


  /**
   * Reference to a field of type 'ZaloAccountFriendStatus[]'
   */
  export type ListEnumZaloAccountFriendStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ZaloAccountFriendStatus[]'>
    


  /**
   * Reference to a field of type 'MessageStatus'
   */
  export type EnumMessageStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageStatus'>
    


  /**
   * Reference to a field of type 'MessageStatus[]'
   */
  export type ListEnumMessageStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: UuidFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ZaloGroupWhereInput = {
    AND?: ZaloGroupWhereInput | ZaloGroupWhereInput[]
    OR?: ZaloGroupWhereInput[]
    NOT?: ZaloGroupWhereInput | ZaloGroupWhereInput[]
    id?: UuidFilter<"ZaloGroup"> | string
    groupName?: StringFilter<"ZaloGroup"> | string
    isUpdateName?: BoolFilter<"ZaloGroup"> | boolean
    createdAt?: DateTimeFilter<"ZaloGroup"> | Date | string
    updatedAt?: DateTimeFilter<"ZaloGroup"> | Date | string
    accountMaps?: ZaloAccountGroupListRelationFilter
    messages?: MessageListRelationFilter
  }

  export type ZaloGroupOrderByWithRelationInput = {
    id?: SortOrder
    groupName?: SortOrder
    isUpdateName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accountMaps?: ZaloAccountGroupOrderByRelationAggregateInput
    messages?: MessageOrderByRelationAggregateInput
  }

  export type ZaloGroupWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ZaloGroupWhereInput | ZaloGroupWhereInput[]
    OR?: ZaloGroupWhereInput[]
    NOT?: ZaloGroupWhereInput | ZaloGroupWhereInput[]
    groupName?: StringFilter<"ZaloGroup"> | string
    isUpdateName?: BoolFilter<"ZaloGroup"> | boolean
    createdAt?: DateTimeFilter<"ZaloGroup"> | Date | string
    updatedAt?: DateTimeFilter<"ZaloGroup"> | Date | string
    accountMaps?: ZaloAccountGroupListRelationFilter
    messages?: MessageListRelationFilter
  }, "id">

  export type ZaloGroupOrderByWithAggregationInput = {
    id?: SortOrder
    groupName?: SortOrder
    isUpdateName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ZaloGroupCountOrderByAggregateInput
    _max?: ZaloGroupMaxOrderByAggregateInput
    _min?: ZaloGroupMinOrderByAggregateInput
  }

  export type ZaloGroupScalarWhereWithAggregatesInput = {
    AND?: ZaloGroupScalarWhereWithAggregatesInput | ZaloGroupScalarWhereWithAggregatesInput[]
    OR?: ZaloGroupScalarWhereWithAggregatesInput[]
    NOT?: ZaloGroupScalarWhereWithAggregatesInput | ZaloGroupScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ZaloGroup"> | string
    groupName?: StringWithAggregatesFilter<"ZaloGroup"> | string
    isUpdateName?: BoolWithAggregatesFilter<"ZaloGroup"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ZaloGroup"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ZaloGroup"> | Date | string
  }

  export type ZaloAccountRelationWhereInput = {
    AND?: ZaloAccountRelationWhereInput | ZaloAccountRelationWhereInput[]
    OR?: ZaloAccountRelationWhereInput[]
    NOT?: ZaloAccountRelationWhereInput | ZaloAccountRelationWhereInput[]
    id?: UuidFilter<"ZaloAccountRelation"> | string
    masterId?: UuidFilter<"ZaloAccountRelation"> | string
    childId?: UuidFilter<"ZaloAccountRelation"> | string
    createdAt?: DateTimeFilter<"ZaloAccountRelation"> | Date | string
    master?: XOR<ZaloAccountScalarRelationFilter, ZaloAccountWhereInput>
    child?: XOR<ZaloAccountScalarRelationFilter, ZaloAccountWhereInput>
  }

  export type ZaloAccountRelationOrderByWithRelationInput = {
    id?: SortOrder
    masterId?: SortOrder
    childId?: SortOrder
    createdAt?: SortOrder
    master?: ZaloAccountOrderByWithRelationInput
    child?: ZaloAccountOrderByWithRelationInput
  }

  export type ZaloAccountRelationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    masterId_childId?: ZaloAccountRelationMasterIdChildIdCompoundUniqueInput
    AND?: ZaloAccountRelationWhereInput | ZaloAccountRelationWhereInput[]
    OR?: ZaloAccountRelationWhereInput[]
    NOT?: ZaloAccountRelationWhereInput | ZaloAccountRelationWhereInput[]
    masterId?: UuidFilter<"ZaloAccountRelation"> | string
    childId?: UuidFilter<"ZaloAccountRelation"> | string
    createdAt?: DateTimeFilter<"ZaloAccountRelation"> | Date | string
    master?: XOR<ZaloAccountScalarRelationFilter, ZaloAccountWhereInput>
    child?: XOR<ZaloAccountScalarRelationFilter, ZaloAccountWhereInput>
  }, "id" | "masterId_childId">

  export type ZaloAccountRelationOrderByWithAggregationInput = {
    id?: SortOrder
    masterId?: SortOrder
    childId?: SortOrder
    createdAt?: SortOrder
    _count?: ZaloAccountRelationCountOrderByAggregateInput
    _max?: ZaloAccountRelationMaxOrderByAggregateInput
    _min?: ZaloAccountRelationMinOrderByAggregateInput
  }

  export type ZaloAccountRelationScalarWhereWithAggregatesInput = {
    AND?: ZaloAccountRelationScalarWhereWithAggregatesInput | ZaloAccountRelationScalarWhereWithAggregatesInput[]
    OR?: ZaloAccountRelationScalarWhereWithAggregatesInput[]
    NOT?: ZaloAccountRelationScalarWhereWithAggregatesInput | ZaloAccountRelationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ZaloAccountRelation"> | string
    masterId?: UuidWithAggregatesFilter<"ZaloAccountRelation"> | string
    childId?: UuidWithAggregatesFilter<"ZaloAccountRelation"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ZaloAccountRelation"> | Date | string
  }

  export type ZaloAccountWhereInput = {
    AND?: ZaloAccountWhereInput | ZaloAccountWhereInput[]
    OR?: ZaloAccountWhereInput[]
    NOT?: ZaloAccountWhereInput | ZaloAccountWhereInput[]
    id?: UuidFilter<"ZaloAccount"> | string
    zaloId?: StringNullableFilter<"ZaloAccount"> | string | null
    phone?: StringNullableFilter<"ZaloAccount"> | string | null
    name?: StringNullableFilter<"ZaloAccount"> | string | null
    isMaster?: BoolFilter<"ZaloAccount"> | boolean
    groupCount?: IntFilter<"ZaloAccount"> | number
    groupData?: JsonNullableFilter<"ZaloAccount">
    createdAt?: DateTimeFilter<"ZaloAccount"> | Date | string
    updatedAt?: DateTimeFilter<"ZaloAccount"> | Date | string
    masters?: ZaloAccountRelationListRelationFilter
    children?: ZaloAccountRelationListRelationFilter
    groupMaps?: ZaloAccountGroupListRelationFilter
    messages?: MessageListRelationFilter
    friends?: ZaloAccountFriendListRelationFilter
    friendOf?: ZaloAccountFriendListRelationFilter
  }

  export type ZaloAccountOrderByWithRelationInput = {
    id?: SortOrder
    zaloId?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    isMaster?: SortOrder
    groupCount?: SortOrder
    groupData?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    masters?: ZaloAccountRelationOrderByRelationAggregateInput
    children?: ZaloAccountRelationOrderByRelationAggregateInput
    groupMaps?: ZaloAccountGroupOrderByRelationAggregateInput
    messages?: MessageOrderByRelationAggregateInput
    friends?: ZaloAccountFriendOrderByRelationAggregateInput
    friendOf?: ZaloAccountFriendOrderByRelationAggregateInput
  }

  export type ZaloAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    zaloId?: string
    AND?: ZaloAccountWhereInput | ZaloAccountWhereInput[]
    OR?: ZaloAccountWhereInput[]
    NOT?: ZaloAccountWhereInput | ZaloAccountWhereInput[]
    phone?: StringNullableFilter<"ZaloAccount"> | string | null
    name?: StringNullableFilter<"ZaloAccount"> | string | null
    isMaster?: BoolFilter<"ZaloAccount"> | boolean
    groupCount?: IntFilter<"ZaloAccount"> | number
    groupData?: JsonNullableFilter<"ZaloAccount">
    createdAt?: DateTimeFilter<"ZaloAccount"> | Date | string
    updatedAt?: DateTimeFilter<"ZaloAccount"> | Date | string
    masters?: ZaloAccountRelationListRelationFilter
    children?: ZaloAccountRelationListRelationFilter
    groupMaps?: ZaloAccountGroupListRelationFilter
    messages?: MessageListRelationFilter
    friends?: ZaloAccountFriendListRelationFilter
    friendOf?: ZaloAccountFriendListRelationFilter
  }, "id" | "zaloId">

  export type ZaloAccountOrderByWithAggregationInput = {
    id?: SortOrder
    zaloId?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    isMaster?: SortOrder
    groupCount?: SortOrder
    groupData?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ZaloAccountCountOrderByAggregateInput
    _avg?: ZaloAccountAvgOrderByAggregateInput
    _max?: ZaloAccountMaxOrderByAggregateInput
    _min?: ZaloAccountMinOrderByAggregateInput
    _sum?: ZaloAccountSumOrderByAggregateInput
  }

  export type ZaloAccountScalarWhereWithAggregatesInput = {
    AND?: ZaloAccountScalarWhereWithAggregatesInput | ZaloAccountScalarWhereWithAggregatesInput[]
    OR?: ZaloAccountScalarWhereWithAggregatesInput[]
    NOT?: ZaloAccountScalarWhereWithAggregatesInput | ZaloAccountScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ZaloAccount"> | string
    zaloId?: StringNullableWithAggregatesFilter<"ZaloAccount"> | string | null
    phone?: StringNullableWithAggregatesFilter<"ZaloAccount"> | string | null
    name?: StringNullableWithAggregatesFilter<"ZaloAccount"> | string | null
    isMaster?: BoolWithAggregatesFilter<"ZaloAccount"> | boolean
    groupCount?: IntWithAggregatesFilter<"ZaloAccount"> | number
    groupData?: JsonNullableWithAggregatesFilter<"ZaloAccount">
    createdAt?: DateTimeWithAggregatesFilter<"ZaloAccount"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ZaloAccount"> | Date | string
  }

  export type ZaloAccountGroupWhereInput = {
    AND?: ZaloAccountGroupWhereInput | ZaloAccountGroupWhereInput[]
    OR?: ZaloAccountGroupWhereInput[]
    NOT?: ZaloAccountGroupWhereInput | ZaloAccountGroupWhereInput[]
    id?: UuidFilter<"ZaloAccountGroup"> | string
    groupZaloId?: StringFilter<"ZaloAccountGroup"> | string
    zaloAccountId?: UuidFilter<"ZaloAccountGroup"> | string
    groupId?: UuidFilter<"ZaloAccountGroup"> | string
    joinedAt?: DateTimeFilter<"ZaloAccountGroup"> | Date | string
    zaloAccount?: XOR<ZaloAccountScalarRelationFilter, ZaloAccountWhereInput>
    group?: XOR<ZaloGroupScalarRelationFilter, ZaloGroupWhereInput>
  }

  export type ZaloAccountGroupOrderByWithRelationInput = {
    id?: SortOrder
    groupZaloId?: SortOrder
    zaloAccountId?: SortOrder
    groupId?: SortOrder
    joinedAt?: SortOrder
    zaloAccount?: ZaloAccountOrderByWithRelationInput
    group?: ZaloGroupOrderByWithRelationInput
  }

  export type ZaloAccountGroupWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    groupZaloId?: string
    AND?: ZaloAccountGroupWhereInput | ZaloAccountGroupWhereInput[]
    OR?: ZaloAccountGroupWhereInput[]
    NOT?: ZaloAccountGroupWhereInput | ZaloAccountGroupWhereInput[]
    zaloAccountId?: UuidFilter<"ZaloAccountGroup"> | string
    groupId?: UuidFilter<"ZaloAccountGroup"> | string
    joinedAt?: DateTimeFilter<"ZaloAccountGroup"> | Date | string
    zaloAccount?: XOR<ZaloAccountScalarRelationFilter, ZaloAccountWhereInput>
    group?: XOR<ZaloGroupScalarRelationFilter, ZaloGroupWhereInput>
  }, "id" | "groupZaloId">

  export type ZaloAccountGroupOrderByWithAggregationInput = {
    id?: SortOrder
    groupZaloId?: SortOrder
    zaloAccountId?: SortOrder
    groupId?: SortOrder
    joinedAt?: SortOrder
    _count?: ZaloAccountGroupCountOrderByAggregateInput
    _max?: ZaloAccountGroupMaxOrderByAggregateInput
    _min?: ZaloAccountGroupMinOrderByAggregateInput
  }

  export type ZaloAccountGroupScalarWhereWithAggregatesInput = {
    AND?: ZaloAccountGroupScalarWhereWithAggregatesInput | ZaloAccountGroupScalarWhereWithAggregatesInput[]
    OR?: ZaloAccountGroupScalarWhereWithAggregatesInput[]
    NOT?: ZaloAccountGroupScalarWhereWithAggregatesInput | ZaloAccountGroupScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ZaloAccountGroup"> | string
    groupZaloId?: StringWithAggregatesFilter<"ZaloAccountGroup"> | string
    zaloAccountId?: UuidWithAggregatesFilter<"ZaloAccountGroup"> | string
    groupId?: UuidWithAggregatesFilter<"ZaloAccountGroup"> | string
    joinedAt?: DateTimeWithAggregatesFilter<"ZaloAccountGroup"> | Date | string
  }

  export type ZaloAccountFriendWhereInput = {
    AND?: ZaloAccountFriendWhereInput | ZaloAccountFriendWhereInput[]
    OR?: ZaloAccountFriendWhereInput[]
    NOT?: ZaloAccountFriendWhereInput | ZaloAccountFriendWhereInput[]
    id?: UuidFilter<"ZaloAccountFriend"> | string
    masterId?: UuidFilter<"ZaloAccountFriend"> | string
    friendId?: UuidFilter<"ZaloAccountFriend"> | string
    status?: EnumZaloAccountFriendStatusFilter<"ZaloAccountFriend"> | $Enums.ZaloAccountFriendStatus
    createdAt?: DateTimeFilter<"ZaloAccountFriend"> | Date | string
    master?: XOR<ZaloAccountScalarRelationFilter, ZaloAccountWhereInput>
    friend?: XOR<ZaloAccountScalarRelationFilter, ZaloAccountWhereInput>
  }

  export type ZaloAccountFriendOrderByWithRelationInput = {
    id?: SortOrder
    masterId?: SortOrder
    friendId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    master?: ZaloAccountOrderByWithRelationInput
    friend?: ZaloAccountOrderByWithRelationInput
  }

  export type ZaloAccountFriendWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    masterId_friendId?: ZaloAccountFriendMasterIdFriendIdCompoundUniqueInput
    AND?: ZaloAccountFriendWhereInput | ZaloAccountFriendWhereInput[]
    OR?: ZaloAccountFriendWhereInput[]
    NOT?: ZaloAccountFriendWhereInput | ZaloAccountFriendWhereInput[]
    masterId?: UuidFilter<"ZaloAccountFriend"> | string
    friendId?: UuidFilter<"ZaloAccountFriend"> | string
    status?: EnumZaloAccountFriendStatusFilter<"ZaloAccountFriend"> | $Enums.ZaloAccountFriendStatus
    createdAt?: DateTimeFilter<"ZaloAccountFriend"> | Date | string
    master?: XOR<ZaloAccountScalarRelationFilter, ZaloAccountWhereInput>
    friend?: XOR<ZaloAccountScalarRelationFilter, ZaloAccountWhereInput>
  }, "id" | "masterId_friendId">

  export type ZaloAccountFriendOrderByWithAggregationInput = {
    id?: SortOrder
    masterId?: SortOrder
    friendId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: ZaloAccountFriendCountOrderByAggregateInput
    _max?: ZaloAccountFriendMaxOrderByAggregateInput
    _min?: ZaloAccountFriendMinOrderByAggregateInput
  }

  export type ZaloAccountFriendScalarWhereWithAggregatesInput = {
    AND?: ZaloAccountFriendScalarWhereWithAggregatesInput | ZaloAccountFriendScalarWhereWithAggregatesInput[]
    OR?: ZaloAccountFriendScalarWhereWithAggregatesInput[]
    NOT?: ZaloAccountFriendScalarWhereWithAggregatesInput | ZaloAccountFriendScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ZaloAccountFriend"> | string
    masterId?: UuidWithAggregatesFilter<"ZaloAccountFriend"> | string
    friendId?: UuidWithAggregatesFilter<"ZaloAccountFriend"> | string
    status?: EnumZaloAccountFriendStatusWithAggregatesFilter<"ZaloAccountFriend"> | $Enums.ZaloAccountFriendStatus
    createdAt?: DateTimeWithAggregatesFilter<"ZaloAccountFriend"> | Date | string
  }

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    id?: UuidFilter<"Message"> | string
    messageZaloId?: StringNullableFilter<"Message"> | string | null
    cliMsgId?: StringNullableFilter<"Message"> | string | null
    uidFrom?: StringNullableFilter<"Message"> | string | null
    content?: StringFilter<"Message"> | string
    senderId?: UuidFilter<"Message"> | string
    groupId?: UuidFilter<"Message"> | string
    sentAt?: DateTimeNullableFilter<"Message"> | Date | string | null
    status?: EnumMessageStatusFilter<"Message"> | $Enums.MessageStatus
    createdAt?: DateTimeFilter<"Message"> | Date | string
    sender?: XOR<ZaloAccountScalarRelationFilter, ZaloAccountWhereInput>
    group?: XOR<ZaloGroupScalarRelationFilter, ZaloGroupWhereInput>
  }

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder
    messageZaloId?: SortOrderInput | SortOrder
    cliMsgId?: SortOrderInput | SortOrder
    uidFrom?: SortOrderInput | SortOrder
    content?: SortOrder
    senderId?: SortOrder
    groupId?: SortOrder
    sentAt?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    sender?: ZaloAccountOrderByWithRelationInput
    group?: ZaloGroupOrderByWithRelationInput
  }

  export type MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    messageZaloId?: StringNullableFilter<"Message"> | string | null
    cliMsgId?: StringNullableFilter<"Message"> | string | null
    uidFrom?: StringNullableFilter<"Message"> | string | null
    content?: StringFilter<"Message"> | string
    senderId?: UuidFilter<"Message"> | string
    groupId?: UuidFilter<"Message"> | string
    sentAt?: DateTimeNullableFilter<"Message"> | Date | string | null
    status?: EnumMessageStatusFilter<"Message"> | $Enums.MessageStatus
    createdAt?: DateTimeFilter<"Message"> | Date | string
    sender?: XOR<ZaloAccountScalarRelationFilter, ZaloAccountWhereInput>
    group?: XOR<ZaloGroupScalarRelationFilter, ZaloGroupWhereInput>
  }, "id">

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder
    messageZaloId?: SortOrderInput | SortOrder
    cliMsgId?: SortOrderInput | SortOrder
    uidFrom?: SortOrderInput | SortOrder
    content?: SortOrder
    senderId?: SortOrder
    groupId?: SortOrder
    sentAt?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: MessageCountOrderByAggregateInput
    _max?: MessageMaxOrderByAggregateInput
    _min?: MessageMinOrderByAggregateInput
  }

  export type MessageScalarWhereWithAggregatesInput = {
    AND?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    OR?: MessageScalarWhereWithAggregatesInput[]
    NOT?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Message"> | string
    messageZaloId?: StringNullableWithAggregatesFilter<"Message"> | string | null
    cliMsgId?: StringNullableWithAggregatesFilter<"Message"> | string | null
    uidFrom?: StringNullableWithAggregatesFilter<"Message"> | string | null
    content?: StringWithAggregatesFilter<"Message"> | string
    senderId?: UuidWithAggregatesFilter<"Message"> | string
    groupId?: UuidWithAggregatesFilter<"Message"> | string
    sentAt?: DateTimeNullableWithAggregatesFilter<"Message"> | Date | string | null
    status?: EnumMessageStatusWithAggregatesFilter<"Message"> | $Enums.MessageStatus
    createdAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
  }

  export type ApiKeyWhereInput = {
    AND?: ApiKeyWhereInput | ApiKeyWhereInput[]
    OR?: ApiKeyWhereInput[]
    NOT?: ApiKeyWhereInput | ApiKeyWhereInput[]
    id?: UuidFilter<"ApiKey"> | string
    name?: StringFilter<"ApiKey"> | string
    secretKey?: StringFilter<"ApiKey"> | string
    isActive?: BoolFilter<"ApiKey"> | boolean
    createdAt?: DateTimeFilter<"ApiKey"> | Date | string
  }

  export type ApiKeyOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    secretKey?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type ApiKeyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    secretKey?: string
    AND?: ApiKeyWhereInput | ApiKeyWhereInput[]
    OR?: ApiKeyWhereInput[]
    NOT?: ApiKeyWhereInput | ApiKeyWhereInput[]
    name?: StringFilter<"ApiKey"> | string
    isActive?: BoolFilter<"ApiKey"> | boolean
    createdAt?: DateTimeFilter<"ApiKey"> | Date | string
  }, "id" | "secretKey">

  export type ApiKeyOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    secretKey?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    _count?: ApiKeyCountOrderByAggregateInput
    _max?: ApiKeyMaxOrderByAggregateInput
    _min?: ApiKeyMinOrderByAggregateInput
  }

  export type ApiKeyScalarWhereWithAggregatesInput = {
    AND?: ApiKeyScalarWhereWithAggregatesInput | ApiKeyScalarWhereWithAggregatesInput[]
    OR?: ApiKeyScalarWhereWithAggregatesInput[]
    NOT?: ApiKeyScalarWhereWithAggregatesInput | ApiKeyScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ApiKey"> | string
    name?: StringWithAggregatesFilter<"ApiKey"> | string
    secretKey?: StringWithAggregatesFilter<"ApiKey"> | string
    isActive?: BoolWithAggregatesFilter<"ApiKey"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ApiKey"> | Date | string
  }

  export type ConfigurationWhereInput = {
    AND?: ConfigurationWhereInput | ConfigurationWhereInput[]
    OR?: ConfigurationWhereInput[]
    NOT?: ConfigurationWhereInput | ConfigurationWhereInput[]
    id?: UuidFilter<"Configuration"> | string
    key?: StringFilter<"Configuration"> | string
    value?: StringFilter<"Configuration"> | string
    updatedAt?: DateTimeFilter<"Configuration"> | Date | string
  }

  export type ConfigurationOrderByWithRelationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConfigurationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    key?: string
    AND?: ConfigurationWhereInput | ConfigurationWhereInput[]
    OR?: ConfigurationWhereInput[]
    NOT?: ConfigurationWhereInput | ConfigurationWhereInput[]
    value?: StringFilter<"Configuration"> | string
    updatedAt?: DateTimeFilter<"Configuration"> | Date | string
  }, "id" | "key">

  export type ConfigurationOrderByWithAggregationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
    _count?: ConfigurationCountOrderByAggregateInput
    _max?: ConfigurationMaxOrderByAggregateInput
    _min?: ConfigurationMinOrderByAggregateInput
  }

  export type ConfigurationScalarWhereWithAggregatesInput = {
    AND?: ConfigurationScalarWhereWithAggregatesInput | ConfigurationScalarWhereWithAggregatesInput[]
    OR?: ConfigurationScalarWhereWithAggregatesInput[]
    NOT?: ConfigurationScalarWhereWithAggregatesInput | ConfigurationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Configuration"> | string
    key?: StringWithAggregatesFilter<"Configuration"> | string
    value?: StringWithAggregatesFilter<"Configuration"> | string
    updatedAt?: DateTimeWithAggregatesFilter<"Configuration"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    password: string
    role: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    role: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    password: string
    role: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloGroupCreateInput = {
    id?: string
    groupName: string
    isUpdateName?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accountMaps?: ZaloAccountGroupCreateNestedManyWithoutGroupInput
    messages?: MessageCreateNestedManyWithoutGroupInput
  }

  export type ZaloGroupUncheckedCreateInput = {
    id?: string
    groupName: string
    isUpdateName?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accountMaps?: ZaloAccountGroupUncheckedCreateNestedManyWithoutGroupInput
    messages?: MessageUncheckedCreateNestedManyWithoutGroupInput
  }

  export type ZaloGroupUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupName?: StringFieldUpdateOperationsInput | string
    isUpdateName?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accountMaps?: ZaloAccountGroupUpdateManyWithoutGroupNestedInput
    messages?: MessageUpdateManyWithoutGroupNestedInput
  }

  export type ZaloGroupUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupName?: StringFieldUpdateOperationsInput | string
    isUpdateName?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accountMaps?: ZaloAccountGroupUncheckedUpdateManyWithoutGroupNestedInput
    messages?: MessageUncheckedUpdateManyWithoutGroupNestedInput
  }

  export type ZaloGroupCreateManyInput = {
    id?: string
    groupName: string
    isUpdateName?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ZaloGroupUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupName?: StringFieldUpdateOperationsInput | string
    isUpdateName?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloGroupUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupName?: StringFieldUpdateOperationsInput | string
    isUpdateName?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountRelationCreateInput = {
    id?: string
    createdAt?: Date | string
    master: ZaloAccountCreateNestedOneWithoutChildrenInput
    child: ZaloAccountCreateNestedOneWithoutMastersInput
  }

  export type ZaloAccountRelationUncheckedCreateInput = {
    id?: string
    masterId: string
    childId: string
    createdAt?: Date | string
  }

  export type ZaloAccountRelationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    master?: ZaloAccountUpdateOneRequiredWithoutChildrenNestedInput
    child?: ZaloAccountUpdateOneRequiredWithoutMastersNestedInput
  }

  export type ZaloAccountRelationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    masterId?: StringFieldUpdateOperationsInput | string
    childId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountRelationCreateManyInput = {
    id?: string
    masterId: string
    childId: string
    createdAt?: Date | string
  }

  export type ZaloAccountRelationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountRelationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    masterId?: StringFieldUpdateOperationsInput | string
    childId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountCreateInput = {
    id?: string
    zaloId?: string | null
    phone?: string | null
    name?: string | null
    isMaster?: boolean
    groupCount?: number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    masters?: ZaloAccountRelationCreateNestedManyWithoutChildInput
    children?: ZaloAccountRelationCreateNestedManyWithoutMasterInput
    groupMaps?: ZaloAccountGroupCreateNestedManyWithoutZaloAccountInput
    messages?: MessageCreateNestedManyWithoutSenderInput
    friends?: ZaloAccountFriendCreateNestedManyWithoutMasterInput
    friendOf?: ZaloAccountFriendCreateNestedManyWithoutFriendInput
  }

  export type ZaloAccountUncheckedCreateInput = {
    id?: string
    zaloId?: string | null
    phone?: string | null
    name?: string | null
    isMaster?: boolean
    groupCount?: number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    masters?: ZaloAccountRelationUncheckedCreateNestedManyWithoutChildInput
    children?: ZaloAccountRelationUncheckedCreateNestedManyWithoutMasterInput
    groupMaps?: ZaloAccountGroupUncheckedCreateNestedManyWithoutZaloAccountInput
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    friends?: ZaloAccountFriendUncheckedCreateNestedManyWithoutMasterInput
    friendOf?: ZaloAccountFriendUncheckedCreateNestedManyWithoutFriendInput
  }

  export type ZaloAccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    zaloId?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    groupCount?: IntFieldUpdateOperationsInput | number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    masters?: ZaloAccountRelationUpdateManyWithoutChildNestedInput
    children?: ZaloAccountRelationUpdateManyWithoutMasterNestedInput
    groupMaps?: ZaloAccountGroupUpdateManyWithoutZaloAccountNestedInput
    messages?: MessageUpdateManyWithoutSenderNestedInput
    friends?: ZaloAccountFriendUpdateManyWithoutMasterNestedInput
    friendOf?: ZaloAccountFriendUpdateManyWithoutFriendNestedInput
  }

  export type ZaloAccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    zaloId?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    groupCount?: IntFieldUpdateOperationsInput | number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    masters?: ZaloAccountRelationUncheckedUpdateManyWithoutChildNestedInput
    children?: ZaloAccountRelationUncheckedUpdateManyWithoutMasterNestedInput
    groupMaps?: ZaloAccountGroupUncheckedUpdateManyWithoutZaloAccountNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    friends?: ZaloAccountFriendUncheckedUpdateManyWithoutMasterNestedInput
    friendOf?: ZaloAccountFriendUncheckedUpdateManyWithoutFriendNestedInput
  }

  export type ZaloAccountCreateManyInput = {
    id?: string
    zaloId?: string | null
    phone?: string | null
    name?: string | null
    isMaster?: boolean
    groupCount?: number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ZaloAccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    zaloId?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    groupCount?: IntFieldUpdateOperationsInput | number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    zaloId?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    groupCount?: IntFieldUpdateOperationsInput | number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountGroupCreateInput = {
    id?: string
    groupZaloId: string
    joinedAt?: Date | string
    zaloAccount: ZaloAccountCreateNestedOneWithoutGroupMapsInput
    group: ZaloGroupCreateNestedOneWithoutAccountMapsInput
  }

  export type ZaloAccountGroupUncheckedCreateInput = {
    id?: string
    groupZaloId: string
    zaloAccountId: string
    groupId: string
    joinedAt?: Date | string
  }

  export type ZaloAccountGroupUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupZaloId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    zaloAccount?: ZaloAccountUpdateOneRequiredWithoutGroupMapsNestedInput
    group?: ZaloGroupUpdateOneRequiredWithoutAccountMapsNestedInput
  }

  export type ZaloAccountGroupUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupZaloId?: StringFieldUpdateOperationsInput | string
    zaloAccountId?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountGroupCreateManyInput = {
    id?: string
    groupZaloId: string
    zaloAccountId: string
    groupId: string
    joinedAt?: Date | string
  }

  export type ZaloAccountGroupUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupZaloId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountGroupUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupZaloId?: StringFieldUpdateOperationsInput | string
    zaloAccountId?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountFriendCreateInput = {
    id?: string
    status?: $Enums.ZaloAccountFriendStatus
    createdAt?: Date | string
    master: ZaloAccountCreateNestedOneWithoutFriendsInput
    friend: ZaloAccountCreateNestedOneWithoutFriendOfInput
  }

  export type ZaloAccountFriendUncheckedCreateInput = {
    id?: string
    masterId: string
    friendId: string
    status?: $Enums.ZaloAccountFriendStatus
    createdAt?: Date | string
  }

  export type ZaloAccountFriendUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumZaloAccountFriendStatusFieldUpdateOperationsInput | $Enums.ZaloAccountFriendStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    master?: ZaloAccountUpdateOneRequiredWithoutFriendsNestedInput
    friend?: ZaloAccountUpdateOneRequiredWithoutFriendOfNestedInput
  }

  export type ZaloAccountFriendUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    masterId?: StringFieldUpdateOperationsInput | string
    friendId?: StringFieldUpdateOperationsInput | string
    status?: EnumZaloAccountFriendStatusFieldUpdateOperationsInput | $Enums.ZaloAccountFriendStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountFriendCreateManyInput = {
    id?: string
    masterId: string
    friendId: string
    status?: $Enums.ZaloAccountFriendStatus
    createdAt?: Date | string
  }

  export type ZaloAccountFriendUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumZaloAccountFriendStatusFieldUpdateOperationsInput | $Enums.ZaloAccountFriendStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountFriendUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    masterId?: StringFieldUpdateOperationsInput | string
    friendId?: StringFieldUpdateOperationsInput | string
    status?: EnumZaloAccountFriendStatusFieldUpdateOperationsInput | $Enums.ZaloAccountFriendStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateInput = {
    id?: string
    messageZaloId?: string | null
    cliMsgId?: string | null
    uidFrom?: string | null
    content: string
    sentAt?: Date | string | null
    status: $Enums.MessageStatus
    createdAt?: Date | string
    sender: ZaloAccountCreateNestedOneWithoutMessagesInput
    group: ZaloGroupCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateInput = {
    id?: string
    messageZaloId?: string | null
    cliMsgId?: string | null
    uidFrom?: string | null
    content: string
    senderId: string
    groupId: string
    sentAt?: Date | string | null
    status: $Enums.MessageStatus
    createdAt?: Date | string
  }

  export type MessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageZaloId?: NullableStringFieldUpdateOperationsInput | string | null
    cliMsgId?: NullableStringFieldUpdateOperationsInput | string | null
    uidFrom?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: ZaloAccountUpdateOneRequiredWithoutMessagesNestedInput
    group?: ZaloGroupUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageZaloId?: NullableStringFieldUpdateOperationsInput | string | null
    cliMsgId?: NullableStringFieldUpdateOperationsInput | string | null
    uidFrom?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateManyInput = {
    id?: string
    messageZaloId?: string | null
    cliMsgId?: string | null
    uidFrom?: string | null
    content: string
    senderId: string
    groupId: string
    sentAt?: Date | string | null
    status: $Enums.MessageStatus
    createdAt?: Date | string
  }

  export type MessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageZaloId?: NullableStringFieldUpdateOperationsInput | string | null
    cliMsgId?: NullableStringFieldUpdateOperationsInput | string | null
    uidFrom?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageZaloId?: NullableStringFieldUpdateOperationsInput | string | null
    cliMsgId?: NullableStringFieldUpdateOperationsInput | string | null
    uidFrom?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyCreateInput = {
    id?: string
    name: string
    secretKey: string
    isActive?: boolean
    createdAt?: Date | string
  }

  export type ApiKeyUncheckedCreateInput = {
    id?: string
    name: string
    secretKey: string
    isActive?: boolean
    createdAt?: Date | string
  }

  export type ApiKeyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    secretKey?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    secretKey?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyCreateManyInput = {
    id?: string
    name: string
    secretKey: string
    isActive?: boolean
    createdAt?: Date | string
  }

  export type ApiKeyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    secretKey?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    secretKey?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfigurationCreateInput = {
    id?: string
    key: string
    value: string
    updatedAt?: Date | string
  }

  export type ConfigurationUncheckedCreateInput = {
    id?: string
    key: string
    value: string
    updatedAt?: Date | string
  }

  export type ConfigurationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfigurationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfigurationCreateManyInput = {
    id?: string
    key: string
    value: string
    updatedAt?: Date | string
  }

  export type ConfigurationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfigurationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type ZaloAccountGroupListRelationFilter = {
    every?: ZaloAccountGroupWhereInput
    some?: ZaloAccountGroupWhereInput
    none?: ZaloAccountGroupWhereInput
  }

  export type MessageListRelationFilter = {
    every?: MessageWhereInput
    some?: MessageWhereInput
    none?: MessageWhereInput
  }

  export type ZaloAccountGroupOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ZaloGroupCountOrderByAggregateInput = {
    id?: SortOrder
    groupName?: SortOrder
    isUpdateName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ZaloGroupMaxOrderByAggregateInput = {
    id?: SortOrder
    groupName?: SortOrder
    isUpdateName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ZaloGroupMinOrderByAggregateInput = {
    id?: SortOrder
    groupName?: SortOrder
    isUpdateName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ZaloAccountScalarRelationFilter = {
    is?: ZaloAccountWhereInput
    isNot?: ZaloAccountWhereInput
  }

  export type ZaloAccountRelationMasterIdChildIdCompoundUniqueInput = {
    masterId: string
    childId: string
  }

  export type ZaloAccountRelationCountOrderByAggregateInput = {
    id?: SortOrder
    masterId?: SortOrder
    childId?: SortOrder
    createdAt?: SortOrder
  }

  export type ZaloAccountRelationMaxOrderByAggregateInput = {
    id?: SortOrder
    masterId?: SortOrder
    childId?: SortOrder
    createdAt?: SortOrder
  }

  export type ZaloAccountRelationMinOrderByAggregateInput = {
    id?: SortOrder
    masterId?: SortOrder
    childId?: SortOrder
    createdAt?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ZaloAccountRelationListRelationFilter = {
    every?: ZaloAccountRelationWhereInput
    some?: ZaloAccountRelationWhereInput
    none?: ZaloAccountRelationWhereInput
  }

  export type ZaloAccountFriendListRelationFilter = {
    every?: ZaloAccountFriendWhereInput
    some?: ZaloAccountFriendWhereInput
    none?: ZaloAccountFriendWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ZaloAccountRelationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ZaloAccountFriendOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ZaloAccountCountOrderByAggregateInput = {
    id?: SortOrder
    zaloId?: SortOrder
    phone?: SortOrder
    name?: SortOrder
    isMaster?: SortOrder
    groupCount?: SortOrder
    groupData?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ZaloAccountAvgOrderByAggregateInput = {
    groupCount?: SortOrder
  }

  export type ZaloAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    zaloId?: SortOrder
    phone?: SortOrder
    name?: SortOrder
    isMaster?: SortOrder
    groupCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ZaloAccountMinOrderByAggregateInput = {
    id?: SortOrder
    zaloId?: SortOrder
    phone?: SortOrder
    name?: SortOrder
    isMaster?: SortOrder
    groupCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ZaloAccountSumOrderByAggregateInput = {
    groupCount?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type ZaloGroupScalarRelationFilter = {
    is?: ZaloGroupWhereInput
    isNot?: ZaloGroupWhereInput
  }

  export type ZaloAccountGroupCountOrderByAggregateInput = {
    id?: SortOrder
    groupZaloId?: SortOrder
    zaloAccountId?: SortOrder
    groupId?: SortOrder
    joinedAt?: SortOrder
  }

  export type ZaloAccountGroupMaxOrderByAggregateInput = {
    id?: SortOrder
    groupZaloId?: SortOrder
    zaloAccountId?: SortOrder
    groupId?: SortOrder
    joinedAt?: SortOrder
  }

  export type ZaloAccountGroupMinOrderByAggregateInput = {
    id?: SortOrder
    groupZaloId?: SortOrder
    zaloAccountId?: SortOrder
    groupId?: SortOrder
    joinedAt?: SortOrder
  }

  export type EnumZaloAccountFriendStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ZaloAccountFriendStatus | EnumZaloAccountFriendStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ZaloAccountFriendStatus[] | ListEnumZaloAccountFriendStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ZaloAccountFriendStatus[] | ListEnumZaloAccountFriendStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumZaloAccountFriendStatusFilter<$PrismaModel> | $Enums.ZaloAccountFriendStatus
  }

  export type ZaloAccountFriendMasterIdFriendIdCompoundUniqueInput = {
    masterId: string
    friendId: string
  }

  export type ZaloAccountFriendCountOrderByAggregateInput = {
    id?: SortOrder
    masterId?: SortOrder
    friendId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ZaloAccountFriendMaxOrderByAggregateInput = {
    id?: SortOrder
    masterId?: SortOrder
    friendId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ZaloAccountFriendMinOrderByAggregateInput = {
    id?: SortOrder
    masterId?: SortOrder
    friendId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumZaloAccountFriendStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ZaloAccountFriendStatus | EnumZaloAccountFriendStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ZaloAccountFriendStatus[] | ListEnumZaloAccountFriendStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ZaloAccountFriendStatus[] | ListEnumZaloAccountFriendStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumZaloAccountFriendStatusWithAggregatesFilter<$PrismaModel> | $Enums.ZaloAccountFriendStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumZaloAccountFriendStatusFilter<$PrismaModel>
    _max?: NestedEnumZaloAccountFriendStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EnumMessageStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatus | EnumMessageStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageStatusFilter<$PrismaModel> | $Enums.MessageStatus
  }

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder
    messageZaloId?: SortOrder
    cliMsgId?: SortOrder
    uidFrom?: SortOrder
    content?: SortOrder
    senderId?: SortOrder
    groupId?: SortOrder
    sentAt?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder
    messageZaloId?: SortOrder
    cliMsgId?: SortOrder
    uidFrom?: SortOrder
    content?: SortOrder
    senderId?: SortOrder
    groupId?: SortOrder
    sentAt?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder
    messageZaloId?: SortOrder
    cliMsgId?: SortOrder
    uidFrom?: SortOrder
    content?: SortOrder
    senderId?: SortOrder
    groupId?: SortOrder
    sentAt?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumMessageStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatus | EnumMessageStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageStatusWithAggregatesFilter<$PrismaModel> | $Enums.MessageStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageStatusFilter<$PrismaModel>
    _max?: NestedEnumMessageStatusFilter<$PrismaModel>
  }

  export type ApiKeyCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    secretKey?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type ApiKeyMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    secretKey?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type ApiKeyMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    secretKey?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type ConfigurationCountOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConfigurationMaxOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConfigurationMinOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ZaloAccountGroupCreateNestedManyWithoutGroupInput = {
    create?: XOR<ZaloAccountGroupCreateWithoutGroupInput, ZaloAccountGroupUncheckedCreateWithoutGroupInput> | ZaloAccountGroupCreateWithoutGroupInput[] | ZaloAccountGroupUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: ZaloAccountGroupCreateOrConnectWithoutGroupInput | ZaloAccountGroupCreateOrConnectWithoutGroupInput[]
    createMany?: ZaloAccountGroupCreateManyGroupInputEnvelope
    connect?: ZaloAccountGroupWhereUniqueInput | ZaloAccountGroupWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutGroupInput = {
    create?: XOR<MessageCreateWithoutGroupInput, MessageUncheckedCreateWithoutGroupInput> | MessageCreateWithoutGroupInput[] | MessageUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutGroupInput | MessageCreateOrConnectWithoutGroupInput[]
    createMany?: MessageCreateManyGroupInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type ZaloAccountGroupUncheckedCreateNestedManyWithoutGroupInput = {
    create?: XOR<ZaloAccountGroupCreateWithoutGroupInput, ZaloAccountGroupUncheckedCreateWithoutGroupInput> | ZaloAccountGroupCreateWithoutGroupInput[] | ZaloAccountGroupUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: ZaloAccountGroupCreateOrConnectWithoutGroupInput | ZaloAccountGroupCreateOrConnectWithoutGroupInput[]
    createMany?: ZaloAccountGroupCreateManyGroupInputEnvelope
    connect?: ZaloAccountGroupWhereUniqueInput | ZaloAccountGroupWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutGroupInput = {
    create?: XOR<MessageCreateWithoutGroupInput, MessageUncheckedCreateWithoutGroupInput> | MessageCreateWithoutGroupInput[] | MessageUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutGroupInput | MessageCreateOrConnectWithoutGroupInput[]
    createMany?: MessageCreateManyGroupInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type ZaloAccountGroupUpdateManyWithoutGroupNestedInput = {
    create?: XOR<ZaloAccountGroupCreateWithoutGroupInput, ZaloAccountGroupUncheckedCreateWithoutGroupInput> | ZaloAccountGroupCreateWithoutGroupInput[] | ZaloAccountGroupUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: ZaloAccountGroupCreateOrConnectWithoutGroupInput | ZaloAccountGroupCreateOrConnectWithoutGroupInput[]
    upsert?: ZaloAccountGroupUpsertWithWhereUniqueWithoutGroupInput | ZaloAccountGroupUpsertWithWhereUniqueWithoutGroupInput[]
    createMany?: ZaloAccountGroupCreateManyGroupInputEnvelope
    set?: ZaloAccountGroupWhereUniqueInput | ZaloAccountGroupWhereUniqueInput[]
    disconnect?: ZaloAccountGroupWhereUniqueInput | ZaloAccountGroupWhereUniqueInput[]
    delete?: ZaloAccountGroupWhereUniqueInput | ZaloAccountGroupWhereUniqueInput[]
    connect?: ZaloAccountGroupWhereUniqueInput | ZaloAccountGroupWhereUniqueInput[]
    update?: ZaloAccountGroupUpdateWithWhereUniqueWithoutGroupInput | ZaloAccountGroupUpdateWithWhereUniqueWithoutGroupInput[]
    updateMany?: ZaloAccountGroupUpdateManyWithWhereWithoutGroupInput | ZaloAccountGroupUpdateManyWithWhereWithoutGroupInput[]
    deleteMany?: ZaloAccountGroupScalarWhereInput | ZaloAccountGroupScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutGroupNestedInput = {
    create?: XOR<MessageCreateWithoutGroupInput, MessageUncheckedCreateWithoutGroupInput> | MessageCreateWithoutGroupInput[] | MessageUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutGroupInput | MessageCreateOrConnectWithoutGroupInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutGroupInput | MessageUpsertWithWhereUniqueWithoutGroupInput[]
    createMany?: MessageCreateManyGroupInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutGroupInput | MessageUpdateWithWhereUniqueWithoutGroupInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutGroupInput | MessageUpdateManyWithWhereWithoutGroupInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type ZaloAccountGroupUncheckedUpdateManyWithoutGroupNestedInput = {
    create?: XOR<ZaloAccountGroupCreateWithoutGroupInput, ZaloAccountGroupUncheckedCreateWithoutGroupInput> | ZaloAccountGroupCreateWithoutGroupInput[] | ZaloAccountGroupUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: ZaloAccountGroupCreateOrConnectWithoutGroupInput | ZaloAccountGroupCreateOrConnectWithoutGroupInput[]
    upsert?: ZaloAccountGroupUpsertWithWhereUniqueWithoutGroupInput | ZaloAccountGroupUpsertWithWhereUniqueWithoutGroupInput[]
    createMany?: ZaloAccountGroupCreateManyGroupInputEnvelope
    set?: ZaloAccountGroupWhereUniqueInput | ZaloAccountGroupWhereUniqueInput[]
    disconnect?: ZaloAccountGroupWhereUniqueInput | ZaloAccountGroupWhereUniqueInput[]
    delete?: ZaloAccountGroupWhereUniqueInput | ZaloAccountGroupWhereUniqueInput[]
    connect?: ZaloAccountGroupWhereUniqueInput | ZaloAccountGroupWhereUniqueInput[]
    update?: ZaloAccountGroupUpdateWithWhereUniqueWithoutGroupInput | ZaloAccountGroupUpdateWithWhereUniqueWithoutGroupInput[]
    updateMany?: ZaloAccountGroupUpdateManyWithWhereWithoutGroupInput | ZaloAccountGroupUpdateManyWithWhereWithoutGroupInput[]
    deleteMany?: ZaloAccountGroupScalarWhereInput | ZaloAccountGroupScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutGroupNestedInput = {
    create?: XOR<MessageCreateWithoutGroupInput, MessageUncheckedCreateWithoutGroupInput> | MessageCreateWithoutGroupInput[] | MessageUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutGroupInput | MessageCreateOrConnectWithoutGroupInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutGroupInput | MessageUpsertWithWhereUniqueWithoutGroupInput[]
    createMany?: MessageCreateManyGroupInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutGroupInput | MessageUpdateWithWhereUniqueWithoutGroupInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutGroupInput | MessageUpdateManyWithWhereWithoutGroupInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type ZaloAccountCreateNestedOneWithoutChildrenInput = {
    create?: XOR<ZaloAccountCreateWithoutChildrenInput, ZaloAccountUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: ZaloAccountCreateOrConnectWithoutChildrenInput
    connect?: ZaloAccountWhereUniqueInput
  }

  export type ZaloAccountCreateNestedOneWithoutMastersInput = {
    create?: XOR<ZaloAccountCreateWithoutMastersInput, ZaloAccountUncheckedCreateWithoutMastersInput>
    connectOrCreate?: ZaloAccountCreateOrConnectWithoutMastersInput
    connect?: ZaloAccountWhereUniqueInput
  }

  export type ZaloAccountUpdateOneRequiredWithoutChildrenNestedInput = {
    create?: XOR<ZaloAccountCreateWithoutChildrenInput, ZaloAccountUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: ZaloAccountCreateOrConnectWithoutChildrenInput
    upsert?: ZaloAccountUpsertWithoutChildrenInput
    connect?: ZaloAccountWhereUniqueInput
    update?: XOR<XOR<ZaloAccountUpdateToOneWithWhereWithoutChildrenInput, ZaloAccountUpdateWithoutChildrenInput>, ZaloAccountUncheckedUpdateWithoutChildrenInput>
  }

  export type ZaloAccountUpdateOneRequiredWithoutMastersNestedInput = {
    create?: XOR<ZaloAccountCreateWithoutMastersInput, ZaloAccountUncheckedCreateWithoutMastersInput>
    connectOrCreate?: ZaloAccountCreateOrConnectWithoutMastersInput
    upsert?: ZaloAccountUpsertWithoutMastersInput
    connect?: ZaloAccountWhereUniqueInput
    update?: XOR<XOR<ZaloAccountUpdateToOneWithWhereWithoutMastersInput, ZaloAccountUpdateWithoutMastersInput>, ZaloAccountUncheckedUpdateWithoutMastersInput>
  }

  export type ZaloAccountRelationCreateNestedManyWithoutChildInput = {
    create?: XOR<ZaloAccountRelationCreateWithoutChildInput, ZaloAccountRelationUncheckedCreateWithoutChildInput> | ZaloAccountRelationCreateWithoutChildInput[] | ZaloAccountRelationUncheckedCreateWithoutChildInput[]
    connectOrCreate?: ZaloAccountRelationCreateOrConnectWithoutChildInput | ZaloAccountRelationCreateOrConnectWithoutChildInput[]
    createMany?: ZaloAccountRelationCreateManyChildInputEnvelope
    connect?: ZaloAccountRelationWhereUniqueInput | ZaloAccountRelationWhereUniqueInput[]
  }

  export type ZaloAccountRelationCreateNestedManyWithoutMasterInput = {
    create?: XOR<ZaloAccountRelationCreateWithoutMasterInput, ZaloAccountRelationUncheckedCreateWithoutMasterInput> | ZaloAccountRelationCreateWithoutMasterInput[] | ZaloAccountRelationUncheckedCreateWithoutMasterInput[]
    connectOrCreate?: ZaloAccountRelationCreateOrConnectWithoutMasterInput | ZaloAccountRelationCreateOrConnectWithoutMasterInput[]
    createMany?: ZaloAccountRelationCreateManyMasterInputEnvelope
    connect?: ZaloAccountRelationWhereUniqueInput | ZaloAccountRelationWhereUniqueInput[]
  }

  export type ZaloAccountGroupCreateNestedManyWithoutZaloAccountInput = {
    create?: XOR<ZaloAccountGroupCreateWithoutZaloAccountInput, ZaloAccountGroupUncheckedCreateWithoutZaloAccountInput> | ZaloAccountGroupCreateWithoutZaloAccountInput[] | ZaloAccountGroupUncheckedCreateWithoutZaloAccountInput[]
    connectOrCreate?: ZaloAccountGroupCreateOrConnectWithoutZaloAccountInput | ZaloAccountGroupCreateOrConnectWithoutZaloAccountInput[]
    createMany?: ZaloAccountGroupCreateManyZaloAccountInputEnvelope
    connect?: ZaloAccountGroupWhereUniqueInput | ZaloAccountGroupWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutSenderInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type ZaloAccountFriendCreateNestedManyWithoutMasterInput = {
    create?: XOR<ZaloAccountFriendCreateWithoutMasterInput, ZaloAccountFriendUncheckedCreateWithoutMasterInput> | ZaloAccountFriendCreateWithoutMasterInput[] | ZaloAccountFriendUncheckedCreateWithoutMasterInput[]
    connectOrCreate?: ZaloAccountFriendCreateOrConnectWithoutMasterInput | ZaloAccountFriendCreateOrConnectWithoutMasterInput[]
    createMany?: ZaloAccountFriendCreateManyMasterInputEnvelope
    connect?: ZaloAccountFriendWhereUniqueInput | ZaloAccountFriendWhereUniqueInput[]
  }

  export type ZaloAccountFriendCreateNestedManyWithoutFriendInput = {
    create?: XOR<ZaloAccountFriendCreateWithoutFriendInput, ZaloAccountFriendUncheckedCreateWithoutFriendInput> | ZaloAccountFriendCreateWithoutFriendInput[] | ZaloAccountFriendUncheckedCreateWithoutFriendInput[]
    connectOrCreate?: ZaloAccountFriendCreateOrConnectWithoutFriendInput | ZaloAccountFriendCreateOrConnectWithoutFriendInput[]
    createMany?: ZaloAccountFriendCreateManyFriendInputEnvelope
    connect?: ZaloAccountFriendWhereUniqueInput | ZaloAccountFriendWhereUniqueInput[]
  }

  export type ZaloAccountRelationUncheckedCreateNestedManyWithoutChildInput = {
    create?: XOR<ZaloAccountRelationCreateWithoutChildInput, ZaloAccountRelationUncheckedCreateWithoutChildInput> | ZaloAccountRelationCreateWithoutChildInput[] | ZaloAccountRelationUncheckedCreateWithoutChildInput[]
    connectOrCreate?: ZaloAccountRelationCreateOrConnectWithoutChildInput | ZaloAccountRelationCreateOrConnectWithoutChildInput[]
    createMany?: ZaloAccountRelationCreateManyChildInputEnvelope
    connect?: ZaloAccountRelationWhereUniqueInput | ZaloAccountRelationWhereUniqueInput[]
  }

  export type ZaloAccountRelationUncheckedCreateNestedManyWithoutMasterInput = {
    create?: XOR<ZaloAccountRelationCreateWithoutMasterInput, ZaloAccountRelationUncheckedCreateWithoutMasterInput> | ZaloAccountRelationCreateWithoutMasterInput[] | ZaloAccountRelationUncheckedCreateWithoutMasterInput[]
    connectOrCreate?: ZaloAccountRelationCreateOrConnectWithoutMasterInput | ZaloAccountRelationCreateOrConnectWithoutMasterInput[]
    createMany?: ZaloAccountRelationCreateManyMasterInputEnvelope
    connect?: ZaloAccountRelationWhereUniqueInput | ZaloAccountRelationWhereUniqueInput[]
  }

  export type ZaloAccountGroupUncheckedCreateNestedManyWithoutZaloAccountInput = {
    create?: XOR<ZaloAccountGroupCreateWithoutZaloAccountInput, ZaloAccountGroupUncheckedCreateWithoutZaloAccountInput> | ZaloAccountGroupCreateWithoutZaloAccountInput[] | ZaloAccountGroupUncheckedCreateWithoutZaloAccountInput[]
    connectOrCreate?: ZaloAccountGroupCreateOrConnectWithoutZaloAccountInput | ZaloAccountGroupCreateOrConnectWithoutZaloAccountInput[]
    createMany?: ZaloAccountGroupCreateManyZaloAccountInputEnvelope
    connect?: ZaloAccountGroupWhereUniqueInput | ZaloAccountGroupWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutSenderInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type ZaloAccountFriendUncheckedCreateNestedManyWithoutMasterInput = {
    create?: XOR<ZaloAccountFriendCreateWithoutMasterInput, ZaloAccountFriendUncheckedCreateWithoutMasterInput> | ZaloAccountFriendCreateWithoutMasterInput[] | ZaloAccountFriendUncheckedCreateWithoutMasterInput[]
    connectOrCreate?: ZaloAccountFriendCreateOrConnectWithoutMasterInput | ZaloAccountFriendCreateOrConnectWithoutMasterInput[]
    createMany?: ZaloAccountFriendCreateManyMasterInputEnvelope
    connect?: ZaloAccountFriendWhereUniqueInput | ZaloAccountFriendWhereUniqueInput[]
  }

  export type ZaloAccountFriendUncheckedCreateNestedManyWithoutFriendInput = {
    create?: XOR<ZaloAccountFriendCreateWithoutFriendInput, ZaloAccountFriendUncheckedCreateWithoutFriendInput> | ZaloAccountFriendCreateWithoutFriendInput[] | ZaloAccountFriendUncheckedCreateWithoutFriendInput[]
    connectOrCreate?: ZaloAccountFriendCreateOrConnectWithoutFriendInput | ZaloAccountFriendCreateOrConnectWithoutFriendInput[]
    createMany?: ZaloAccountFriendCreateManyFriendInputEnvelope
    connect?: ZaloAccountFriendWhereUniqueInput | ZaloAccountFriendWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ZaloAccountRelationUpdateManyWithoutChildNestedInput = {
    create?: XOR<ZaloAccountRelationCreateWithoutChildInput, ZaloAccountRelationUncheckedCreateWithoutChildInput> | ZaloAccountRelationCreateWithoutChildInput[] | ZaloAccountRelationUncheckedCreateWithoutChildInput[]
    connectOrCreate?: ZaloAccountRelationCreateOrConnectWithoutChildInput | ZaloAccountRelationCreateOrConnectWithoutChildInput[]
    upsert?: ZaloAccountRelationUpsertWithWhereUniqueWithoutChildInput | ZaloAccountRelationUpsertWithWhereUniqueWithoutChildInput[]
    createMany?: ZaloAccountRelationCreateManyChildInputEnvelope
    set?: ZaloAccountRelationWhereUniqueInput | ZaloAccountRelationWhereUniqueInput[]
    disconnect?: ZaloAccountRelationWhereUniqueInput | ZaloAccountRelationWhereUniqueInput[]
    delete?: ZaloAccountRelationWhereUniqueInput | ZaloAccountRelationWhereUniqueInput[]
    connect?: ZaloAccountRelationWhereUniqueInput | ZaloAccountRelationWhereUniqueInput[]
    update?: ZaloAccountRelationUpdateWithWhereUniqueWithoutChildInput | ZaloAccountRelationUpdateWithWhereUniqueWithoutChildInput[]
    updateMany?: ZaloAccountRelationUpdateManyWithWhereWithoutChildInput | ZaloAccountRelationUpdateManyWithWhereWithoutChildInput[]
    deleteMany?: ZaloAccountRelationScalarWhereInput | ZaloAccountRelationScalarWhereInput[]
  }

  export type ZaloAccountRelationUpdateManyWithoutMasterNestedInput = {
    create?: XOR<ZaloAccountRelationCreateWithoutMasterInput, ZaloAccountRelationUncheckedCreateWithoutMasterInput> | ZaloAccountRelationCreateWithoutMasterInput[] | ZaloAccountRelationUncheckedCreateWithoutMasterInput[]
    connectOrCreate?: ZaloAccountRelationCreateOrConnectWithoutMasterInput | ZaloAccountRelationCreateOrConnectWithoutMasterInput[]
    upsert?: ZaloAccountRelationUpsertWithWhereUniqueWithoutMasterInput | ZaloAccountRelationUpsertWithWhereUniqueWithoutMasterInput[]
    createMany?: ZaloAccountRelationCreateManyMasterInputEnvelope
    set?: ZaloAccountRelationWhereUniqueInput | ZaloAccountRelationWhereUniqueInput[]
    disconnect?: ZaloAccountRelationWhereUniqueInput | ZaloAccountRelationWhereUniqueInput[]
    delete?: ZaloAccountRelationWhereUniqueInput | ZaloAccountRelationWhereUniqueInput[]
    connect?: ZaloAccountRelationWhereUniqueInput | ZaloAccountRelationWhereUniqueInput[]
    update?: ZaloAccountRelationUpdateWithWhereUniqueWithoutMasterInput | ZaloAccountRelationUpdateWithWhereUniqueWithoutMasterInput[]
    updateMany?: ZaloAccountRelationUpdateManyWithWhereWithoutMasterInput | ZaloAccountRelationUpdateManyWithWhereWithoutMasterInput[]
    deleteMany?: ZaloAccountRelationScalarWhereInput | ZaloAccountRelationScalarWhereInput[]
  }

  export type ZaloAccountGroupUpdateManyWithoutZaloAccountNestedInput = {
    create?: XOR<ZaloAccountGroupCreateWithoutZaloAccountInput, ZaloAccountGroupUncheckedCreateWithoutZaloAccountInput> | ZaloAccountGroupCreateWithoutZaloAccountInput[] | ZaloAccountGroupUncheckedCreateWithoutZaloAccountInput[]
    connectOrCreate?: ZaloAccountGroupCreateOrConnectWithoutZaloAccountInput | ZaloAccountGroupCreateOrConnectWithoutZaloAccountInput[]
    upsert?: ZaloAccountGroupUpsertWithWhereUniqueWithoutZaloAccountInput | ZaloAccountGroupUpsertWithWhereUniqueWithoutZaloAccountInput[]
    createMany?: ZaloAccountGroupCreateManyZaloAccountInputEnvelope
    set?: ZaloAccountGroupWhereUniqueInput | ZaloAccountGroupWhereUniqueInput[]
    disconnect?: ZaloAccountGroupWhereUniqueInput | ZaloAccountGroupWhereUniqueInput[]
    delete?: ZaloAccountGroupWhereUniqueInput | ZaloAccountGroupWhereUniqueInput[]
    connect?: ZaloAccountGroupWhereUniqueInput | ZaloAccountGroupWhereUniqueInput[]
    update?: ZaloAccountGroupUpdateWithWhereUniqueWithoutZaloAccountInput | ZaloAccountGroupUpdateWithWhereUniqueWithoutZaloAccountInput[]
    updateMany?: ZaloAccountGroupUpdateManyWithWhereWithoutZaloAccountInput | ZaloAccountGroupUpdateManyWithWhereWithoutZaloAccountInput[]
    deleteMany?: ZaloAccountGroupScalarWhereInput | ZaloAccountGroupScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutSenderNestedInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutSenderInput | MessageUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutSenderInput | MessageUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutSenderInput | MessageUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type ZaloAccountFriendUpdateManyWithoutMasterNestedInput = {
    create?: XOR<ZaloAccountFriendCreateWithoutMasterInput, ZaloAccountFriendUncheckedCreateWithoutMasterInput> | ZaloAccountFriendCreateWithoutMasterInput[] | ZaloAccountFriendUncheckedCreateWithoutMasterInput[]
    connectOrCreate?: ZaloAccountFriendCreateOrConnectWithoutMasterInput | ZaloAccountFriendCreateOrConnectWithoutMasterInput[]
    upsert?: ZaloAccountFriendUpsertWithWhereUniqueWithoutMasterInput | ZaloAccountFriendUpsertWithWhereUniqueWithoutMasterInput[]
    createMany?: ZaloAccountFriendCreateManyMasterInputEnvelope
    set?: ZaloAccountFriendWhereUniqueInput | ZaloAccountFriendWhereUniqueInput[]
    disconnect?: ZaloAccountFriendWhereUniqueInput | ZaloAccountFriendWhereUniqueInput[]
    delete?: ZaloAccountFriendWhereUniqueInput | ZaloAccountFriendWhereUniqueInput[]
    connect?: ZaloAccountFriendWhereUniqueInput | ZaloAccountFriendWhereUniqueInput[]
    update?: ZaloAccountFriendUpdateWithWhereUniqueWithoutMasterInput | ZaloAccountFriendUpdateWithWhereUniqueWithoutMasterInput[]
    updateMany?: ZaloAccountFriendUpdateManyWithWhereWithoutMasterInput | ZaloAccountFriendUpdateManyWithWhereWithoutMasterInput[]
    deleteMany?: ZaloAccountFriendScalarWhereInput | ZaloAccountFriendScalarWhereInput[]
  }

  export type ZaloAccountFriendUpdateManyWithoutFriendNestedInput = {
    create?: XOR<ZaloAccountFriendCreateWithoutFriendInput, ZaloAccountFriendUncheckedCreateWithoutFriendInput> | ZaloAccountFriendCreateWithoutFriendInput[] | ZaloAccountFriendUncheckedCreateWithoutFriendInput[]
    connectOrCreate?: ZaloAccountFriendCreateOrConnectWithoutFriendInput | ZaloAccountFriendCreateOrConnectWithoutFriendInput[]
    upsert?: ZaloAccountFriendUpsertWithWhereUniqueWithoutFriendInput | ZaloAccountFriendUpsertWithWhereUniqueWithoutFriendInput[]
    createMany?: ZaloAccountFriendCreateManyFriendInputEnvelope
    set?: ZaloAccountFriendWhereUniqueInput | ZaloAccountFriendWhereUniqueInput[]
    disconnect?: ZaloAccountFriendWhereUniqueInput | ZaloAccountFriendWhereUniqueInput[]
    delete?: ZaloAccountFriendWhereUniqueInput | ZaloAccountFriendWhereUniqueInput[]
    connect?: ZaloAccountFriendWhereUniqueInput | ZaloAccountFriendWhereUniqueInput[]
    update?: ZaloAccountFriendUpdateWithWhereUniqueWithoutFriendInput | ZaloAccountFriendUpdateWithWhereUniqueWithoutFriendInput[]
    updateMany?: ZaloAccountFriendUpdateManyWithWhereWithoutFriendInput | ZaloAccountFriendUpdateManyWithWhereWithoutFriendInput[]
    deleteMany?: ZaloAccountFriendScalarWhereInput | ZaloAccountFriendScalarWhereInput[]
  }

  export type ZaloAccountRelationUncheckedUpdateManyWithoutChildNestedInput = {
    create?: XOR<ZaloAccountRelationCreateWithoutChildInput, ZaloAccountRelationUncheckedCreateWithoutChildInput> | ZaloAccountRelationCreateWithoutChildInput[] | ZaloAccountRelationUncheckedCreateWithoutChildInput[]
    connectOrCreate?: ZaloAccountRelationCreateOrConnectWithoutChildInput | ZaloAccountRelationCreateOrConnectWithoutChildInput[]
    upsert?: ZaloAccountRelationUpsertWithWhereUniqueWithoutChildInput | ZaloAccountRelationUpsertWithWhereUniqueWithoutChildInput[]
    createMany?: ZaloAccountRelationCreateManyChildInputEnvelope
    set?: ZaloAccountRelationWhereUniqueInput | ZaloAccountRelationWhereUniqueInput[]
    disconnect?: ZaloAccountRelationWhereUniqueInput | ZaloAccountRelationWhereUniqueInput[]
    delete?: ZaloAccountRelationWhereUniqueInput | ZaloAccountRelationWhereUniqueInput[]
    connect?: ZaloAccountRelationWhereUniqueInput | ZaloAccountRelationWhereUniqueInput[]
    update?: ZaloAccountRelationUpdateWithWhereUniqueWithoutChildInput | ZaloAccountRelationUpdateWithWhereUniqueWithoutChildInput[]
    updateMany?: ZaloAccountRelationUpdateManyWithWhereWithoutChildInput | ZaloAccountRelationUpdateManyWithWhereWithoutChildInput[]
    deleteMany?: ZaloAccountRelationScalarWhereInput | ZaloAccountRelationScalarWhereInput[]
  }

  export type ZaloAccountRelationUncheckedUpdateManyWithoutMasterNestedInput = {
    create?: XOR<ZaloAccountRelationCreateWithoutMasterInput, ZaloAccountRelationUncheckedCreateWithoutMasterInput> | ZaloAccountRelationCreateWithoutMasterInput[] | ZaloAccountRelationUncheckedCreateWithoutMasterInput[]
    connectOrCreate?: ZaloAccountRelationCreateOrConnectWithoutMasterInput | ZaloAccountRelationCreateOrConnectWithoutMasterInput[]
    upsert?: ZaloAccountRelationUpsertWithWhereUniqueWithoutMasterInput | ZaloAccountRelationUpsertWithWhereUniqueWithoutMasterInput[]
    createMany?: ZaloAccountRelationCreateManyMasterInputEnvelope
    set?: ZaloAccountRelationWhereUniqueInput | ZaloAccountRelationWhereUniqueInput[]
    disconnect?: ZaloAccountRelationWhereUniqueInput | ZaloAccountRelationWhereUniqueInput[]
    delete?: ZaloAccountRelationWhereUniqueInput | ZaloAccountRelationWhereUniqueInput[]
    connect?: ZaloAccountRelationWhereUniqueInput | ZaloAccountRelationWhereUniqueInput[]
    update?: ZaloAccountRelationUpdateWithWhereUniqueWithoutMasterInput | ZaloAccountRelationUpdateWithWhereUniqueWithoutMasterInput[]
    updateMany?: ZaloAccountRelationUpdateManyWithWhereWithoutMasterInput | ZaloAccountRelationUpdateManyWithWhereWithoutMasterInput[]
    deleteMany?: ZaloAccountRelationScalarWhereInput | ZaloAccountRelationScalarWhereInput[]
  }

  export type ZaloAccountGroupUncheckedUpdateManyWithoutZaloAccountNestedInput = {
    create?: XOR<ZaloAccountGroupCreateWithoutZaloAccountInput, ZaloAccountGroupUncheckedCreateWithoutZaloAccountInput> | ZaloAccountGroupCreateWithoutZaloAccountInput[] | ZaloAccountGroupUncheckedCreateWithoutZaloAccountInput[]
    connectOrCreate?: ZaloAccountGroupCreateOrConnectWithoutZaloAccountInput | ZaloAccountGroupCreateOrConnectWithoutZaloAccountInput[]
    upsert?: ZaloAccountGroupUpsertWithWhereUniqueWithoutZaloAccountInput | ZaloAccountGroupUpsertWithWhereUniqueWithoutZaloAccountInput[]
    createMany?: ZaloAccountGroupCreateManyZaloAccountInputEnvelope
    set?: ZaloAccountGroupWhereUniqueInput | ZaloAccountGroupWhereUniqueInput[]
    disconnect?: ZaloAccountGroupWhereUniqueInput | ZaloAccountGroupWhereUniqueInput[]
    delete?: ZaloAccountGroupWhereUniqueInput | ZaloAccountGroupWhereUniqueInput[]
    connect?: ZaloAccountGroupWhereUniqueInput | ZaloAccountGroupWhereUniqueInput[]
    update?: ZaloAccountGroupUpdateWithWhereUniqueWithoutZaloAccountInput | ZaloAccountGroupUpdateWithWhereUniqueWithoutZaloAccountInput[]
    updateMany?: ZaloAccountGroupUpdateManyWithWhereWithoutZaloAccountInput | ZaloAccountGroupUpdateManyWithWhereWithoutZaloAccountInput[]
    deleteMany?: ZaloAccountGroupScalarWhereInput | ZaloAccountGroupScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutSenderNestedInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutSenderInput | MessageUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutSenderInput | MessageUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutSenderInput | MessageUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type ZaloAccountFriendUncheckedUpdateManyWithoutMasterNestedInput = {
    create?: XOR<ZaloAccountFriendCreateWithoutMasterInput, ZaloAccountFriendUncheckedCreateWithoutMasterInput> | ZaloAccountFriendCreateWithoutMasterInput[] | ZaloAccountFriendUncheckedCreateWithoutMasterInput[]
    connectOrCreate?: ZaloAccountFriendCreateOrConnectWithoutMasterInput | ZaloAccountFriendCreateOrConnectWithoutMasterInput[]
    upsert?: ZaloAccountFriendUpsertWithWhereUniqueWithoutMasterInput | ZaloAccountFriendUpsertWithWhereUniqueWithoutMasterInput[]
    createMany?: ZaloAccountFriendCreateManyMasterInputEnvelope
    set?: ZaloAccountFriendWhereUniqueInput | ZaloAccountFriendWhereUniqueInput[]
    disconnect?: ZaloAccountFriendWhereUniqueInput | ZaloAccountFriendWhereUniqueInput[]
    delete?: ZaloAccountFriendWhereUniqueInput | ZaloAccountFriendWhereUniqueInput[]
    connect?: ZaloAccountFriendWhereUniqueInput | ZaloAccountFriendWhereUniqueInput[]
    update?: ZaloAccountFriendUpdateWithWhereUniqueWithoutMasterInput | ZaloAccountFriendUpdateWithWhereUniqueWithoutMasterInput[]
    updateMany?: ZaloAccountFriendUpdateManyWithWhereWithoutMasterInput | ZaloAccountFriendUpdateManyWithWhereWithoutMasterInput[]
    deleteMany?: ZaloAccountFriendScalarWhereInput | ZaloAccountFriendScalarWhereInput[]
  }

  export type ZaloAccountFriendUncheckedUpdateManyWithoutFriendNestedInput = {
    create?: XOR<ZaloAccountFriendCreateWithoutFriendInput, ZaloAccountFriendUncheckedCreateWithoutFriendInput> | ZaloAccountFriendCreateWithoutFriendInput[] | ZaloAccountFriendUncheckedCreateWithoutFriendInput[]
    connectOrCreate?: ZaloAccountFriendCreateOrConnectWithoutFriendInput | ZaloAccountFriendCreateOrConnectWithoutFriendInput[]
    upsert?: ZaloAccountFriendUpsertWithWhereUniqueWithoutFriendInput | ZaloAccountFriendUpsertWithWhereUniqueWithoutFriendInput[]
    createMany?: ZaloAccountFriendCreateManyFriendInputEnvelope
    set?: ZaloAccountFriendWhereUniqueInput | ZaloAccountFriendWhereUniqueInput[]
    disconnect?: ZaloAccountFriendWhereUniqueInput | ZaloAccountFriendWhereUniqueInput[]
    delete?: ZaloAccountFriendWhereUniqueInput | ZaloAccountFriendWhereUniqueInput[]
    connect?: ZaloAccountFriendWhereUniqueInput | ZaloAccountFriendWhereUniqueInput[]
    update?: ZaloAccountFriendUpdateWithWhereUniqueWithoutFriendInput | ZaloAccountFriendUpdateWithWhereUniqueWithoutFriendInput[]
    updateMany?: ZaloAccountFriendUpdateManyWithWhereWithoutFriendInput | ZaloAccountFriendUpdateManyWithWhereWithoutFriendInput[]
    deleteMany?: ZaloAccountFriendScalarWhereInput | ZaloAccountFriendScalarWhereInput[]
  }

  export type ZaloAccountCreateNestedOneWithoutGroupMapsInput = {
    create?: XOR<ZaloAccountCreateWithoutGroupMapsInput, ZaloAccountUncheckedCreateWithoutGroupMapsInput>
    connectOrCreate?: ZaloAccountCreateOrConnectWithoutGroupMapsInput
    connect?: ZaloAccountWhereUniqueInput
  }

  export type ZaloGroupCreateNestedOneWithoutAccountMapsInput = {
    create?: XOR<ZaloGroupCreateWithoutAccountMapsInput, ZaloGroupUncheckedCreateWithoutAccountMapsInput>
    connectOrCreate?: ZaloGroupCreateOrConnectWithoutAccountMapsInput
    connect?: ZaloGroupWhereUniqueInput
  }

  export type ZaloAccountUpdateOneRequiredWithoutGroupMapsNestedInput = {
    create?: XOR<ZaloAccountCreateWithoutGroupMapsInput, ZaloAccountUncheckedCreateWithoutGroupMapsInput>
    connectOrCreate?: ZaloAccountCreateOrConnectWithoutGroupMapsInput
    upsert?: ZaloAccountUpsertWithoutGroupMapsInput
    connect?: ZaloAccountWhereUniqueInput
    update?: XOR<XOR<ZaloAccountUpdateToOneWithWhereWithoutGroupMapsInput, ZaloAccountUpdateWithoutGroupMapsInput>, ZaloAccountUncheckedUpdateWithoutGroupMapsInput>
  }

  export type ZaloGroupUpdateOneRequiredWithoutAccountMapsNestedInput = {
    create?: XOR<ZaloGroupCreateWithoutAccountMapsInput, ZaloGroupUncheckedCreateWithoutAccountMapsInput>
    connectOrCreate?: ZaloGroupCreateOrConnectWithoutAccountMapsInput
    upsert?: ZaloGroupUpsertWithoutAccountMapsInput
    connect?: ZaloGroupWhereUniqueInput
    update?: XOR<XOR<ZaloGroupUpdateToOneWithWhereWithoutAccountMapsInput, ZaloGroupUpdateWithoutAccountMapsInput>, ZaloGroupUncheckedUpdateWithoutAccountMapsInput>
  }

  export type ZaloAccountCreateNestedOneWithoutFriendsInput = {
    create?: XOR<ZaloAccountCreateWithoutFriendsInput, ZaloAccountUncheckedCreateWithoutFriendsInput>
    connectOrCreate?: ZaloAccountCreateOrConnectWithoutFriendsInput
    connect?: ZaloAccountWhereUniqueInput
  }

  export type ZaloAccountCreateNestedOneWithoutFriendOfInput = {
    create?: XOR<ZaloAccountCreateWithoutFriendOfInput, ZaloAccountUncheckedCreateWithoutFriendOfInput>
    connectOrCreate?: ZaloAccountCreateOrConnectWithoutFriendOfInput
    connect?: ZaloAccountWhereUniqueInput
  }

  export type EnumZaloAccountFriendStatusFieldUpdateOperationsInput = {
    set?: $Enums.ZaloAccountFriendStatus
  }

  export type ZaloAccountUpdateOneRequiredWithoutFriendsNestedInput = {
    create?: XOR<ZaloAccountCreateWithoutFriendsInput, ZaloAccountUncheckedCreateWithoutFriendsInput>
    connectOrCreate?: ZaloAccountCreateOrConnectWithoutFriendsInput
    upsert?: ZaloAccountUpsertWithoutFriendsInput
    connect?: ZaloAccountWhereUniqueInput
    update?: XOR<XOR<ZaloAccountUpdateToOneWithWhereWithoutFriendsInput, ZaloAccountUpdateWithoutFriendsInput>, ZaloAccountUncheckedUpdateWithoutFriendsInput>
  }

  export type ZaloAccountUpdateOneRequiredWithoutFriendOfNestedInput = {
    create?: XOR<ZaloAccountCreateWithoutFriendOfInput, ZaloAccountUncheckedCreateWithoutFriendOfInput>
    connectOrCreate?: ZaloAccountCreateOrConnectWithoutFriendOfInput
    upsert?: ZaloAccountUpsertWithoutFriendOfInput
    connect?: ZaloAccountWhereUniqueInput
    update?: XOR<XOR<ZaloAccountUpdateToOneWithWhereWithoutFriendOfInput, ZaloAccountUpdateWithoutFriendOfInput>, ZaloAccountUncheckedUpdateWithoutFriendOfInput>
  }

  export type ZaloAccountCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ZaloAccountCreateWithoutMessagesInput, ZaloAccountUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ZaloAccountCreateOrConnectWithoutMessagesInput
    connect?: ZaloAccountWhereUniqueInput
  }

  export type ZaloGroupCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ZaloGroupCreateWithoutMessagesInput, ZaloGroupUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ZaloGroupCreateOrConnectWithoutMessagesInput
    connect?: ZaloGroupWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EnumMessageStatusFieldUpdateOperationsInput = {
    set?: $Enums.MessageStatus
  }

  export type ZaloAccountUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<ZaloAccountCreateWithoutMessagesInput, ZaloAccountUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ZaloAccountCreateOrConnectWithoutMessagesInput
    upsert?: ZaloAccountUpsertWithoutMessagesInput
    connect?: ZaloAccountWhereUniqueInput
    update?: XOR<XOR<ZaloAccountUpdateToOneWithWhereWithoutMessagesInput, ZaloAccountUpdateWithoutMessagesInput>, ZaloAccountUncheckedUpdateWithoutMessagesInput>
  }

  export type ZaloGroupUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<ZaloGroupCreateWithoutMessagesInput, ZaloGroupUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ZaloGroupCreateOrConnectWithoutMessagesInput
    upsert?: ZaloGroupUpsertWithoutMessagesInput
    connect?: ZaloGroupWhereUniqueInput
    update?: XOR<XOR<ZaloGroupUpdateToOneWithWhereWithoutMessagesInput, ZaloGroupUpdateWithoutMessagesInput>, ZaloGroupUncheckedUpdateWithoutMessagesInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumZaloAccountFriendStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ZaloAccountFriendStatus | EnumZaloAccountFriendStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ZaloAccountFriendStatus[] | ListEnumZaloAccountFriendStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ZaloAccountFriendStatus[] | ListEnumZaloAccountFriendStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumZaloAccountFriendStatusFilter<$PrismaModel> | $Enums.ZaloAccountFriendStatus
  }

  export type NestedEnumZaloAccountFriendStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ZaloAccountFriendStatus | EnumZaloAccountFriendStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ZaloAccountFriendStatus[] | ListEnumZaloAccountFriendStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ZaloAccountFriendStatus[] | ListEnumZaloAccountFriendStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumZaloAccountFriendStatusWithAggregatesFilter<$PrismaModel> | $Enums.ZaloAccountFriendStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumZaloAccountFriendStatusFilter<$PrismaModel>
    _max?: NestedEnumZaloAccountFriendStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumMessageStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatus | EnumMessageStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageStatusFilter<$PrismaModel> | $Enums.MessageStatus
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumMessageStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatus | EnumMessageStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageStatus[] | ListEnumMessageStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageStatusWithAggregatesFilter<$PrismaModel> | $Enums.MessageStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageStatusFilter<$PrismaModel>
    _max?: NestedEnumMessageStatusFilter<$PrismaModel>
  }

  export type ZaloAccountGroupCreateWithoutGroupInput = {
    id?: string
    groupZaloId: string
    joinedAt?: Date | string
    zaloAccount: ZaloAccountCreateNestedOneWithoutGroupMapsInput
  }

  export type ZaloAccountGroupUncheckedCreateWithoutGroupInput = {
    id?: string
    groupZaloId: string
    zaloAccountId: string
    joinedAt?: Date | string
  }

  export type ZaloAccountGroupCreateOrConnectWithoutGroupInput = {
    where: ZaloAccountGroupWhereUniqueInput
    create: XOR<ZaloAccountGroupCreateWithoutGroupInput, ZaloAccountGroupUncheckedCreateWithoutGroupInput>
  }

  export type ZaloAccountGroupCreateManyGroupInputEnvelope = {
    data: ZaloAccountGroupCreateManyGroupInput | ZaloAccountGroupCreateManyGroupInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutGroupInput = {
    id?: string
    messageZaloId?: string | null
    cliMsgId?: string | null
    uidFrom?: string | null
    content: string
    sentAt?: Date | string | null
    status: $Enums.MessageStatus
    createdAt?: Date | string
    sender: ZaloAccountCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateWithoutGroupInput = {
    id?: string
    messageZaloId?: string | null
    cliMsgId?: string | null
    uidFrom?: string | null
    content: string
    senderId: string
    sentAt?: Date | string | null
    status: $Enums.MessageStatus
    createdAt?: Date | string
  }

  export type MessageCreateOrConnectWithoutGroupInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutGroupInput, MessageUncheckedCreateWithoutGroupInput>
  }

  export type MessageCreateManyGroupInputEnvelope = {
    data: MessageCreateManyGroupInput | MessageCreateManyGroupInput[]
    skipDuplicates?: boolean
  }

  export type ZaloAccountGroupUpsertWithWhereUniqueWithoutGroupInput = {
    where: ZaloAccountGroupWhereUniqueInput
    update: XOR<ZaloAccountGroupUpdateWithoutGroupInput, ZaloAccountGroupUncheckedUpdateWithoutGroupInput>
    create: XOR<ZaloAccountGroupCreateWithoutGroupInput, ZaloAccountGroupUncheckedCreateWithoutGroupInput>
  }

  export type ZaloAccountGroupUpdateWithWhereUniqueWithoutGroupInput = {
    where: ZaloAccountGroupWhereUniqueInput
    data: XOR<ZaloAccountGroupUpdateWithoutGroupInput, ZaloAccountGroupUncheckedUpdateWithoutGroupInput>
  }

  export type ZaloAccountGroupUpdateManyWithWhereWithoutGroupInput = {
    where: ZaloAccountGroupScalarWhereInput
    data: XOR<ZaloAccountGroupUpdateManyMutationInput, ZaloAccountGroupUncheckedUpdateManyWithoutGroupInput>
  }

  export type ZaloAccountGroupScalarWhereInput = {
    AND?: ZaloAccountGroupScalarWhereInput | ZaloAccountGroupScalarWhereInput[]
    OR?: ZaloAccountGroupScalarWhereInput[]
    NOT?: ZaloAccountGroupScalarWhereInput | ZaloAccountGroupScalarWhereInput[]
    id?: UuidFilter<"ZaloAccountGroup"> | string
    groupZaloId?: StringFilter<"ZaloAccountGroup"> | string
    zaloAccountId?: UuidFilter<"ZaloAccountGroup"> | string
    groupId?: UuidFilter<"ZaloAccountGroup"> | string
    joinedAt?: DateTimeFilter<"ZaloAccountGroup"> | Date | string
  }

  export type MessageUpsertWithWhereUniqueWithoutGroupInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutGroupInput, MessageUncheckedUpdateWithoutGroupInput>
    create: XOR<MessageCreateWithoutGroupInput, MessageUncheckedCreateWithoutGroupInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutGroupInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutGroupInput, MessageUncheckedUpdateWithoutGroupInput>
  }

  export type MessageUpdateManyWithWhereWithoutGroupInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutGroupInput>
  }

  export type MessageScalarWhereInput = {
    AND?: MessageScalarWhereInput | MessageScalarWhereInput[]
    OR?: MessageScalarWhereInput[]
    NOT?: MessageScalarWhereInput | MessageScalarWhereInput[]
    id?: UuidFilter<"Message"> | string
    messageZaloId?: StringNullableFilter<"Message"> | string | null
    cliMsgId?: StringNullableFilter<"Message"> | string | null
    uidFrom?: StringNullableFilter<"Message"> | string | null
    content?: StringFilter<"Message"> | string
    senderId?: UuidFilter<"Message"> | string
    groupId?: UuidFilter<"Message"> | string
    sentAt?: DateTimeNullableFilter<"Message"> | Date | string | null
    status?: EnumMessageStatusFilter<"Message"> | $Enums.MessageStatus
    createdAt?: DateTimeFilter<"Message"> | Date | string
  }

  export type ZaloAccountCreateWithoutChildrenInput = {
    id?: string
    zaloId?: string | null
    phone?: string | null
    name?: string | null
    isMaster?: boolean
    groupCount?: number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    masters?: ZaloAccountRelationCreateNestedManyWithoutChildInput
    groupMaps?: ZaloAccountGroupCreateNestedManyWithoutZaloAccountInput
    messages?: MessageCreateNestedManyWithoutSenderInput
    friends?: ZaloAccountFriendCreateNestedManyWithoutMasterInput
    friendOf?: ZaloAccountFriendCreateNestedManyWithoutFriendInput
  }

  export type ZaloAccountUncheckedCreateWithoutChildrenInput = {
    id?: string
    zaloId?: string | null
    phone?: string | null
    name?: string | null
    isMaster?: boolean
    groupCount?: number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    masters?: ZaloAccountRelationUncheckedCreateNestedManyWithoutChildInput
    groupMaps?: ZaloAccountGroupUncheckedCreateNestedManyWithoutZaloAccountInput
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    friends?: ZaloAccountFriendUncheckedCreateNestedManyWithoutMasterInput
    friendOf?: ZaloAccountFriendUncheckedCreateNestedManyWithoutFriendInput
  }

  export type ZaloAccountCreateOrConnectWithoutChildrenInput = {
    where: ZaloAccountWhereUniqueInput
    create: XOR<ZaloAccountCreateWithoutChildrenInput, ZaloAccountUncheckedCreateWithoutChildrenInput>
  }

  export type ZaloAccountCreateWithoutMastersInput = {
    id?: string
    zaloId?: string | null
    phone?: string | null
    name?: string | null
    isMaster?: boolean
    groupCount?: number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: ZaloAccountRelationCreateNestedManyWithoutMasterInput
    groupMaps?: ZaloAccountGroupCreateNestedManyWithoutZaloAccountInput
    messages?: MessageCreateNestedManyWithoutSenderInput
    friends?: ZaloAccountFriendCreateNestedManyWithoutMasterInput
    friendOf?: ZaloAccountFriendCreateNestedManyWithoutFriendInput
  }

  export type ZaloAccountUncheckedCreateWithoutMastersInput = {
    id?: string
    zaloId?: string | null
    phone?: string | null
    name?: string | null
    isMaster?: boolean
    groupCount?: number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: ZaloAccountRelationUncheckedCreateNestedManyWithoutMasterInput
    groupMaps?: ZaloAccountGroupUncheckedCreateNestedManyWithoutZaloAccountInput
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    friends?: ZaloAccountFriendUncheckedCreateNestedManyWithoutMasterInput
    friendOf?: ZaloAccountFriendUncheckedCreateNestedManyWithoutFriendInput
  }

  export type ZaloAccountCreateOrConnectWithoutMastersInput = {
    where: ZaloAccountWhereUniqueInput
    create: XOR<ZaloAccountCreateWithoutMastersInput, ZaloAccountUncheckedCreateWithoutMastersInput>
  }

  export type ZaloAccountUpsertWithoutChildrenInput = {
    update: XOR<ZaloAccountUpdateWithoutChildrenInput, ZaloAccountUncheckedUpdateWithoutChildrenInput>
    create: XOR<ZaloAccountCreateWithoutChildrenInput, ZaloAccountUncheckedCreateWithoutChildrenInput>
    where?: ZaloAccountWhereInput
  }

  export type ZaloAccountUpdateToOneWithWhereWithoutChildrenInput = {
    where?: ZaloAccountWhereInput
    data: XOR<ZaloAccountUpdateWithoutChildrenInput, ZaloAccountUncheckedUpdateWithoutChildrenInput>
  }

  export type ZaloAccountUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    zaloId?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    groupCount?: IntFieldUpdateOperationsInput | number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    masters?: ZaloAccountRelationUpdateManyWithoutChildNestedInput
    groupMaps?: ZaloAccountGroupUpdateManyWithoutZaloAccountNestedInput
    messages?: MessageUpdateManyWithoutSenderNestedInput
    friends?: ZaloAccountFriendUpdateManyWithoutMasterNestedInput
    friendOf?: ZaloAccountFriendUpdateManyWithoutFriendNestedInput
  }

  export type ZaloAccountUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    zaloId?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    groupCount?: IntFieldUpdateOperationsInput | number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    masters?: ZaloAccountRelationUncheckedUpdateManyWithoutChildNestedInput
    groupMaps?: ZaloAccountGroupUncheckedUpdateManyWithoutZaloAccountNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    friends?: ZaloAccountFriendUncheckedUpdateManyWithoutMasterNestedInput
    friendOf?: ZaloAccountFriendUncheckedUpdateManyWithoutFriendNestedInput
  }

  export type ZaloAccountUpsertWithoutMastersInput = {
    update: XOR<ZaloAccountUpdateWithoutMastersInput, ZaloAccountUncheckedUpdateWithoutMastersInput>
    create: XOR<ZaloAccountCreateWithoutMastersInput, ZaloAccountUncheckedCreateWithoutMastersInput>
    where?: ZaloAccountWhereInput
  }

  export type ZaloAccountUpdateToOneWithWhereWithoutMastersInput = {
    where?: ZaloAccountWhereInput
    data: XOR<ZaloAccountUpdateWithoutMastersInput, ZaloAccountUncheckedUpdateWithoutMastersInput>
  }

  export type ZaloAccountUpdateWithoutMastersInput = {
    id?: StringFieldUpdateOperationsInput | string
    zaloId?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    groupCount?: IntFieldUpdateOperationsInput | number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: ZaloAccountRelationUpdateManyWithoutMasterNestedInput
    groupMaps?: ZaloAccountGroupUpdateManyWithoutZaloAccountNestedInput
    messages?: MessageUpdateManyWithoutSenderNestedInput
    friends?: ZaloAccountFriendUpdateManyWithoutMasterNestedInput
    friendOf?: ZaloAccountFriendUpdateManyWithoutFriendNestedInput
  }

  export type ZaloAccountUncheckedUpdateWithoutMastersInput = {
    id?: StringFieldUpdateOperationsInput | string
    zaloId?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    groupCount?: IntFieldUpdateOperationsInput | number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: ZaloAccountRelationUncheckedUpdateManyWithoutMasterNestedInput
    groupMaps?: ZaloAccountGroupUncheckedUpdateManyWithoutZaloAccountNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    friends?: ZaloAccountFriendUncheckedUpdateManyWithoutMasterNestedInput
    friendOf?: ZaloAccountFriendUncheckedUpdateManyWithoutFriendNestedInput
  }

  export type ZaloAccountRelationCreateWithoutChildInput = {
    id?: string
    createdAt?: Date | string
    master: ZaloAccountCreateNestedOneWithoutChildrenInput
  }

  export type ZaloAccountRelationUncheckedCreateWithoutChildInput = {
    id?: string
    masterId: string
    createdAt?: Date | string
  }

  export type ZaloAccountRelationCreateOrConnectWithoutChildInput = {
    where: ZaloAccountRelationWhereUniqueInput
    create: XOR<ZaloAccountRelationCreateWithoutChildInput, ZaloAccountRelationUncheckedCreateWithoutChildInput>
  }

  export type ZaloAccountRelationCreateManyChildInputEnvelope = {
    data: ZaloAccountRelationCreateManyChildInput | ZaloAccountRelationCreateManyChildInput[]
    skipDuplicates?: boolean
  }

  export type ZaloAccountRelationCreateWithoutMasterInput = {
    id?: string
    createdAt?: Date | string
    child: ZaloAccountCreateNestedOneWithoutMastersInput
  }

  export type ZaloAccountRelationUncheckedCreateWithoutMasterInput = {
    id?: string
    childId: string
    createdAt?: Date | string
  }

  export type ZaloAccountRelationCreateOrConnectWithoutMasterInput = {
    where: ZaloAccountRelationWhereUniqueInput
    create: XOR<ZaloAccountRelationCreateWithoutMasterInput, ZaloAccountRelationUncheckedCreateWithoutMasterInput>
  }

  export type ZaloAccountRelationCreateManyMasterInputEnvelope = {
    data: ZaloAccountRelationCreateManyMasterInput | ZaloAccountRelationCreateManyMasterInput[]
    skipDuplicates?: boolean
  }

  export type ZaloAccountGroupCreateWithoutZaloAccountInput = {
    id?: string
    groupZaloId: string
    joinedAt?: Date | string
    group: ZaloGroupCreateNestedOneWithoutAccountMapsInput
  }

  export type ZaloAccountGroupUncheckedCreateWithoutZaloAccountInput = {
    id?: string
    groupZaloId: string
    groupId: string
    joinedAt?: Date | string
  }

  export type ZaloAccountGroupCreateOrConnectWithoutZaloAccountInput = {
    where: ZaloAccountGroupWhereUniqueInput
    create: XOR<ZaloAccountGroupCreateWithoutZaloAccountInput, ZaloAccountGroupUncheckedCreateWithoutZaloAccountInput>
  }

  export type ZaloAccountGroupCreateManyZaloAccountInputEnvelope = {
    data: ZaloAccountGroupCreateManyZaloAccountInput | ZaloAccountGroupCreateManyZaloAccountInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutSenderInput = {
    id?: string
    messageZaloId?: string | null
    cliMsgId?: string | null
    uidFrom?: string | null
    content: string
    sentAt?: Date | string | null
    status: $Enums.MessageStatus
    createdAt?: Date | string
    group: ZaloGroupCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateWithoutSenderInput = {
    id?: string
    messageZaloId?: string | null
    cliMsgId?: string | null
    uidFrom?: string | null
    content: string
    groupId: string
    sentAt?: Date | string | null
    status: $Enums.MessageStatus
    createdAt?: Date | string
  }

  export type MessageCreateOrConnectWithoutSenderInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput>
  }

  export type MessageCreateManySenderInputEnvelope = {
    data: MessageCreateManySenderInput | MessageCreateManySenderInput[]
    skipDuplicates?: boolean
  }

  export type ZaloAccountFriendCreateWithoutMasterInput = {
    id?: string
    status?: $Enums.ZaloAccountFriendStatus
    createdAt?: Date | string
    friend: ZaloAccountCreateNestedOneWithoutFriendOfInput
  }

  export type ZaloAccountFriendUncheckedCreateWithoutMasterInput = {
    id?: string
    friendId: string
    status?: $Enums.ZaloAccountFriendStatus
    createdAt?: Date | string
  }

  export type ZaloAccountFriendCreateOrConnectWithoutMasterInput = {
    where: ZaloAccountFriendWhereUniqueInput
    create: XOR<ZaloAccountFriendCreateWithoutMasterInput, ZaloAccountFriendUncheckedCreateWithoutMasterInput>
  }

  export type ZaloAccountFriendCreateManyMasterInputEnvelope = {
    data: ZaloAccountFriendCreateManyMasterInput | ZaloAccountFriendCreateManyMasterInput[]
    skipDuplicates?: boolean
  }

  export type ZaloAccountFriendCreateWithoutFriendInput = {
    id?: string
    status?: $Enums.ZaloAccountFriendStatus
    createdAt?: Date | string
    master: ZaloAccountCreateNestedOneWithoutFriendsInput
  }

  export type ZaloAccountFriendUncheckedCreateWithoutFriendInput = {
    id?: string
    masterId: string
    status?: $Enums.ZaloAccountFriendStatus
    createdAt?: Date | string
  }

  export type ZaloAccountFriendCreateOrConnectWithoutFriendInput = {
    where: ZaloAccountFriendWhereUniqueInput
    create: XOR<ZaloAccountFriendCreateWithoutFriendInput, ZaloAccountFriendUncheckedCreateWithoutFriendInput>
  }

  export type ZaloAccountFriendCreateManyFriendInputEnvelope = {
    data: ZaloAccountFriendCreateManyFriendInput | ZaloAccountFriendCreateManyFriendInput[]
    skipDuplicates?: boolean
  }

  export type ZaloAccountRelationUpsertWithWhereUniqueWithoutChildInput = {
    where: ZaloAccountRelationWhereUniqueInput
    update: XOR<ZaloAccountRelationUpdateWithoutChildInput, ZaloAccountRelationUncheckedUpdateWithoutChildInput>
    create: XOR<ZaloAccountRelationCreateWithoutChildInput, ZaloAccountRelationUncheckedCreateWithoutChildInput>
  }

  export type ZaloAccountRelationUpdateWithWhereUniqueWithoutChildInput = {
    where: ZaloAccountRelationWhereUniqueInput
    data: XOR<ZaloAccountRelationUpdateWithoutChildInput, ZaloAccountRelationUncheckedUpdateWithoutChildInput>
  }

  export type ZaloAccountRelationUpdateManyWithWhereWithoutChildInput = {
    where: ZaloAccountRelationScalarWhereInput
    data: XOR<ZaloAccountRelationUpdateManyMutationInput, ZaloAccountRelationUncheckedUpdateManyWithoutChildInput>
  }

  export type ZaloAccountRelationScalarWhereInput = {
    AND?: ZaloAccountRelationScalarWhereInput | ZaloAccountRelationScalarWhereInput[]
    OR?: ZaloAccountRelationScalarWhereInput[]
    NOT?: ZaloAccountRelationScalarWhereInput | ZaloAccountRelationScalarWhereInput[]
    id?: UuidFilter<"ZaloAccountRelation"> | string
    masterId?: UuidFilter<"ZaloAccountRelation"> | string
    childId?: UuidFilter<"ZaloAccountRelation"> | string
    createdAt?: DateTimeFilter<"ZaloAccountRelation"> | Date | string
  }

  export type ZaloAccountRelationUpsertWithWhereUniqueWithoutMasterInput = {
    where: ZaloAccountRelationWhereUniqueInput
    update: XOR<ZaloAccountRelationUpdateWithoutMasterInput, ZaloAccountRelationUncheckedUpdateWithoutMasterInput>
    create: XOR<ZaloAccountRelationCreateWithoutMasterInput, ZaloAccountRelationUncheckedCreateWithoutMasterInput>
  }

  export type ZaloAccountRelationUpdateWithWhereUniqueWithoutMasterInput = {
    where: ZaloAccountRelationWhereUniqueInput
    data: XOR<ZaloAccountRelationUpdateWithoutMasterInput, ZaloAccountRelationUncheckedUpdateWithoutMasterInput>
  }

  export type ZaloAccountRelationUpdateManyWithWhereWithoutMasterInput = {
    where: ZaloAccountRelationScalarWhereInput
    data: XOR<ZaloAccountRelationUpdateManyMutationInput, ZaloAccountRelationUncheckedUpdateManyWithoutMasterInput>
  }

  export type ZaloAccountGroupUpsertWithWhereUniqueWithoutZaloAccountInput = {
    where: ZaloAccountGroupWhereUniqueInput
    update: XOR<ZaloAccountGroupUpdateWithoutZaloAccountInput, ZaloAccountGroupUncheckedUpdateWithoutZaloAccountInput>
    create: XOR<ZaloAccountGroupCreateWithoutZaloAccountInput, ZaloAccountGroupUncheckedCreateWithoutZaloAccountInput>
  }

  export type ZaloAccountGroupUpdateWithWhereUniqueWithoutZaloAccountInput = {
    where: ZaloAccountGroupWhereUniqueInput
    data: XOR<ZaloAccountGroupUpdateWithoutZaloAccountInput, ZaloAccountGroupUncheckedUpdateWithoutZaloAccountInput>
  }

  export type ZaloAccountGroupUpdateManyWithWhereWithoutZaloAccountInput = {
    where: ZaloAccountGroupScalarWhereInput
    data: XOR<ZaloAccountGroupUpdateManyMutationInput, ZaloAccountGroupUncheckedUpdateManyWithoutZaloAccountInput>
  }

  export type MessageUpsertWithWhereUniqueWithoutSenderInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutSenderInput, MessageUncheckedUpdateWithoutSenderInput>
    create: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutSenderInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutSenderInput, MessageUncheckedUpdateWithoutSenderInput>
  }

  export type MessageUpdateManyWithWhereWithoutSenderInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutSenderInput>
  }

  export type ZaloAccountFriendUpsertWithWhereUniqueWithoutMasterInput = {
    where: ZaloAccountFriendWhereUniqueInput
    update: XOR<ZaloAccountFriendUpdateWithoutMasterInput, ZaloAccountFriendUncheckedUpdateWithoutMasterInput>
    create: XOR<ZaloAccountFriendCreateWithoutMasterInput, ZaloAccountFriendUncheckedCreateWithoutMasterInput>
  }

  export type ZaloAccountFriendUpdateWithWhereUniqueWithoutMasterInput = {
    where: ZaloAccountFriendWhereUniqueInput
    data: XOR<ZaloAccountFriendUpdateWithoutMasterInput, ZaloAccountFriendUncheckedUpdateWithoutMasterInput>
  }

  export type ZaloAccountFriendUpdateManyWithWhereWithoutMasterInput = {
    where: ZaloAccountFriendScalarWhereInput
    data: XOR<ZaloAccountFriendUpdateManyMutationInput, ZaloAccountFriendUncheckedUpdateManyWithoutMasterInput>
  }

  export type ZaloAccountFriendScalarWhereInput = {
    AND?: ZaloAccountFriendScalarWhereInput | ZaloAccountFriendScalarWhereInput[]
    OR?: ZaloAccountFriendScalarWhereInput[]
    NOT?: ZaloAccountFriendScalarWhereInput | ZaloAccountFriendScalarWhereInput[]
    id?: UuidFilter<"ZaloAccountFriend"> | string
    masterId?: UuidFilter<"ZaloAccountFriend"> | string
    friendId?: UuidFilter<"ZaloAccountFriend"> | string
    status?: EnumZaloAccountFriendStatusFilter<"ZaloAccountFriend"> | $Enums.ZaloAccountFriendStatus
    createdAt?: DateTimeFilter<"ZaloAccountFriend"> | Date | string
  }

  export type ZaloAccountFriendUpsertWithWhereUniqueWithoutFriendInput = {
    where: ZaloAccountFriendWhereUniqueInput
    update: XOR<ZaloAccountFriendUpdateWithoutFriendInput, ZaloAccountFriendUncheckedUpdateWithoutFriendInput>
    create: XOR<ZaloAccountFriendCreateWithoutFriendInput, ZaloAccountFriendUncheckedCreateWithoutFriendInput>
  }

  export type ZaloAccountFriendUpdateWithWhereUniqueWithoutFriendInput = {
    where: ZaloAccountFriendWhereUniqueInput
    data: XOR<ZaloAccountFriendUpdateWithoutFriendInput, ZaloAccountFriendUncheckedUpdateWithoutFriendInput>
  }

  export type ZaloAccountFriendUpdateManyWithWhereWithoutFriendInput = {
    where: ZaloAccountFriendScalarWhereInput
    data: XOR<ZaloAccountFriendUpdateManyMutationInput, ZaloAccountFriendUncheckedUpdateManyWithoutFriendInput>
  }

  export type ZaloAccountCreateWithoutGroupMapsInput = {
    id?: string
    zaloId?: string | null
    phone?: string | null
    name?: string | null
    isMaster?: boolean
    groupCount?: number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    masters?: ZaloAccountRelationCreateNestedManyWithoutChildInput
    children?: ZaloAccountRelationCreateNestedManyWithoutMasterInput
    messages?: MessageCreateNestedManyWithoutSenderInput
    friends?: ZaloAccountFriendCreateNestedManyWithoutMasterInput
    friendOf?: ZaloAccountFriendCreateNestedManyWithoutFriendInput
  }

  export type ZaloAccountUncheckedCreateWithoutGroupMapsInput = {
    id?: string
    zaloId?: string | null
    phone?: string | null
    name?: string | null
    isMaster?: boolean
    groupCount?: number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    masters?: ZaloAccountRelationUncheckedCreateNestedManyWithoutChildInput
    children?: ZaloAccountRelationUncheckedCreateNestedManyWithoutMasterInput
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    friends?: ZaloAccountFriendUncheckedCreateNestedManyWithoutMasterInput
    friendOf?: ZaloAccountFriendUncheckedCreateNestedManyWithoutFriendInput
  }

  export type ZaloAccountCreateOrConnectWithoutGroupMapsInput = {
    where: ZaloAccountWhereUniqueInput
    create: XOR<ZaloAccountCreateWithoutGroupMapsInput, ZaloAccountUncheckedCreateWithoutGroupMapsInput>
  }

  export type ZaloGroupCreateWithoutAccountMapsInput = {
    id?: string
    groupName: string
    isUpdateName?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: MessageCreateNestedManyWithoutGroupInput
  }

  export type ZaloGroupUncheckedCreateWithoutAccountMapsInput = {
    id?: string
    groupName: string
    isUpdateName?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: MessageUncheckedCreateNestedManyWithoutGroupInput
  }

  export type ZaloGroupCreateOrConnectWithoutAccountMapsInput = {
    where: ZaloGroupWhereUniqueInput
    create: XOR<ZaloGroupCreateWithoutAccountMapsInput, ZaloGroupUncheckedCreateWithoutAccountMapsInput>
  }

  export type ZaloAccountUpsertWithoutGroupMapsInput = {
    update: XOR<ZaloAccountUpdateWithoutGroupMapsInput, ZaloAccountUncheckedUpdateWithoutGroupMapsInput>
    create: XOR<ZaloAccountCreateWithoutGroupMapsInput, ZaloAccountUncheckedCreateWithoutGroupMapsInput>
    where?: ZaloAccountWhereInput
  }

  export type ZaloAccountUpdateToOneWithWhereWithoutGroupMapsInput = {
    where?: ZaloAccountWhereInput
    data: XOR<ZaloAccountUpdateWithoutGroupMapsInput, ZaloAccountUncheckedUpdateWithoutGroupMapsInput>
  }

  export type ZaloAccountUpdateWithoutGroupMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    zaloId?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    groupCount?: IntFieldUpdateOperationsInput | number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    masters?: ZaloAccountRelationUpdateManyWithoutChildNestedInput
    children?: ZaloAccountRelationUpdateManyWithoutMasterNestedInput
    messages?: MessageUpdateManyWithoutSenderNestedInput
    friends?: ZaloAccountFriendUpdateManyWithoutMasterNestedInput
    friendOf?: ZaloAccountFriendUpdateManyWithoutFriendNestedInput
  }

  export type ZaloAccountUncheckedUpdateWithoutGroupMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    zaloId?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    groupCount?: IntFieldUpdateOperationsInput | number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    masters?: ZaloAccountRelationUncheckedUpdateManyWithoutChildNestedInput
    children?: ZaloAccountRelationUncheckedUpdateManyWithoutMasterNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    friends?: ZaloAccountFriendUncheckedUpdateManyWithoutMasterNestedInput
    friendOf?: ZaloAccountFriendUncheckedUpdateManyWithoutFriendNestedInput
  }

  export type ZaloGroupUpsertWithoutAccountMapsInput = {
    update: XOR<ZaloGroupUpdateWithoutAccountMapsInput, ZaloGroupUncheckedUpdateWithoutAccountMapsInput>
    create: XOR<ZaloGroupCreateWithoutAccountMapsInput, ZaloGroupUncheckedCreateWithoutAccountMapsInput>
    where?: ZaloGroupWhereInput
  }

  export type ZaloGroupUpdateToOneWithWhereWithoutAccountMapsInput = {
    where?: ZaloGroupWhereInput
    data: XOR<ZaloGroupUpdateWithoutAccountMapsInput, ZaloGroupUncheckedUpdateWithoutAccountMapsInput>
  }

  export type ZaloGroupUpdateWithoutAccountMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupName?: StringFieldUpdateOperationsInput | string
    isUpdateName?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUpdateManyWithoutGroupNestedInput
  }

  export type ZaloGroupUncheckedUpdateWithoutAccountMapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupName?: StringFieldUpdateOperationsInput | string
    isUpdateName?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUncheckedUpdateManyWithoutGroupNestedInput
  }

  export type ZaloAccountCreateWithoutFriendsInput = {
    id?: string
    zaloId?: string | null
    phone?: string | null
    name?: string | null
    isMaster?: boolean
    groupCount?: number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    masters?: ZaloAccountRelationCreateNestedManyWithoutChildInput
    children?: ZaloAccountRelationCreateNestedManyWithoutMasterInput
    groupMaps?: ZaloAccountGroupCreateNestedManyWithoutZaloAccountInput
    messages?: MessageCreateNestedManyWithoutSenderInput
    friendOf?: ZaloAccountFriendCreateNestedManyWithoutFriendInput
  }

  export type ZaloAccountUncheckedCreateWithoutFriendsInput = {
    id?: string
    zaloId?: string | null
    phone?: string | null
    name?: string | null
    isMaster?: boolean
    groupCount?: number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    masters?: ZaloAccountRelationUncheckedCreateNestedManyWithoutChildInput
    children?: ZaloAccountRelationUncheckedCreateNestedManyWithoutMasterInput
    groupMaps?: ZaloAccountGroupUncheckedCreateNestedManyWithoutZaloAccountInput
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    friendOf?: ZaloAccountFriendUncheckedCreateNestedManyWithoutFriendInput
  }

  export type ZaloAccountCreateOrConnectWithoutFriendsInput = {
    where: ZaloAccountWhereUniqueInput
    create: XOR<ZaloAccountCreateWithoutFriendsInput, ZaloAccountUncheckedCreateWithoutFriendsInput>
  }

  export type ZaloAccountCreateWithoutFriendOfInput = {
    id?: string
    zaloId?: string | null
    phone?: string | null
    name?: string | null
    isMaster?: boolean
    groupCount?: number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    masters?: ZaloAccountRelationCreateNestedManyWithoutChildInput
    children?: ZaloAccountRelationCreateNestedManyWithoutMasterInput
    groupMaps?: ZaloAccountGroupCreateNestedManyWithoutZaloAccountInput
    messages?: MessageCreateNestedManyWithoutSenderInput
    friends?: ZaloAccountFriendCreateNestedManyWithoutMasterInput
  }

  export type ZaloAccountUncheckedCreateWithoutFriendOfInput = {
    id?: string
    zaloId?: string | null
    phone?: string | null
    name?: string | null
    isMaster?: boolean
    groupCount?: number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    masters?: ZaloAccountRelationUncheckedCreateNestedManyWithoutChildInput
    children?: ZaloAccountRelationUncheckedCreateNestedManyWithoutMasterInput
    groupMaps?: ZaloAccountGroupUncheckedCreateNestedManyWithoutZaloAccountInput
    messages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    friends?: ZaloAccountFriendUncheckedCreateNestedManyWithoutMasterInput
  }

  export type ZaloAccountCreateOrConnectWithoutFriendOfInput = {
    where: ZaloAccountWhereUniqueInput
    create: XOR<ZaloAccountCreateWithoutFriendOfInput, ZaloAccountUncheckedCreateWithoutFriendOfInput>
  }

  export type ZaloAccountUpsertWithoutFriendsInput = {
    update: XOR<ZaloAccountUpdateWithoutFriendsInput, ZaloAccountUncheckedUpdateWithoutFriendsInput>
    create: XOR<ZaloAccountCreateWithoutFriendsInput, ZaloAccountUncheckedCreateWithoutFriendsInput>
    where?: ZaloAccountWhereInput
  }

  export type ZaloAccountUpdateToOneWithWhereWithoutFriendsInput = {
    where?: ZaloAccountWhereInput
    data: XOR<ZaloAccountUpdateWithoutFriendsInput, ZaloAccountUncheckedUpdateWithoutFriendsInput>
  }

  export type ZaloAccountUpdateWithoutFriendsInput = {
    id?: StringFieldUpdateOperationsInput | string
    zaloId?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    groupCount?: IntFieldUpdateOperationsInput | number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    masters?: ZaloAccountRelationUpdateManyWithoutChildNestedInput
    children?: ZaloAccountRelationUpdateManyWithoutMasterNestedInput
    groupMaps?: ZaloAccountGroupUpdateManyWithoutZaloAccountNestedInput
    messages?: MessageUpdateManyWithoutSenderNestedInput
    friendOf?: ZaloAccountFriendUpdateManyWithoutFriendNestedInput
  }

  export type ZaloAccountUncheckedUpdateWithoutFriendsInput = {
    id?: StringFieldUpdateOperationsInput | string
    zaloId?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    groupCount?: IntFieldUpdateOperationsInput | number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    masters?: ZaloAccountRelationUncheckedUpdateManyWithoutChildNestedInput
    children?: ZaloAccountRelationUncheckedUpdateManyWithoutMasterNestedInput
    groupMaps?: ZaloAccountGroupUncheckedUpdateManyWithoutZaloAccountNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    friendOf?: ZaloAccountFriendUncheckedUpdateManyWithoutFriendNestedInput
  }

  export type ZaloAccountUpsertWithoutFriendOfInput = {
    update: XOR<ZaloAccountUpdateWithoutFriendOfInput, ZaloAccountUncheckedUpdateWithoutFriendOfInput>
    create: XOR<ZaloAccountCreateWithoutFriendOfInput, ZaloAccountUncheckedCreateWithoutFriendOfInput>
    where?: ZaloAccountWhereInput
  }

  export type ZaloAccountUpdateToOneWithWhereWithoutFriendOfInput = {
    where?: ZaloAccountWhereInput
    data: XOR<ZaloAccountUpdateWithoutFriendOfInput, ZaloAccountUncheckedUpdateWithoutFriendOfInput>
  }

  export type ZaloAccountUpdateWithoutFriendOfInput = {
    id?: StringFieldUpdateOperationsInput | string
    zaloId?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    groupCount?: IntFieldUpdateOperationsInput | number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    masters?: ZaloAccountRelationUpdateManyWithoutChildNestedInput
    children?: ZaloAccountRelationUpdateManyWithoutMasterNestedInput
    groupMaps?: ZaloAccountGroupUpdateManyWithoutZaloAccountNestedInput
    messages?: MessageUpdateManyWithoutSenderNestedInput
    friends?: ZaloAccountFriendUpdateManyWithoutMasterNestedInput
  }

  export type ZaloAccountUncheckedUpdateWithoutFriendOfInput = {
    id?: StringFieldUpdateOperationsInput | string
    zaloId?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    groupCount?: IntFieldUpdateOperationsInput | number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    masters?: ZaloAccountRelationUncheckedUpdateManyWithoutChildNestedInput
    children?: ZaloAccountRelationUncheckedUpdateManyWithoutMasterNestedInput
    groupMaps?: ZaloAccountGroupUncheckedUpdateManyWithoutZaloAccountNestedInput
    messages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    friends?: ZaloAccountFriendUncheckedUpdateManyWithoutMasterNestedInput
  }

  export type ZaloAccountCreateWithoutMessagesInput = {
    id?: string
    zaloId?: string | null
    phone?: string | null
    name?: string | null
    isMaster?: boolean
    groupCount?: number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    masters?: ZaloAccountRelationCreateNestedManyWithoutChildInput
    children?: ZaloAccountRelationCreateNestedManyWithoutMasterInput
    groupMaps?: ZaloAccountGroupCreateNestedManyWithoutZaloAccountInput
    friends?: ZaloAccountFriendCreateNestedManyWithoutMasterInput
    friendOf?: ZaloAccountFriendCreateNestedManyWithoutFriendInput
  }

  export type ZaloAccountUncheckedCreateWithoutMessagesInput = {
    id?: string
    zaloId?: string | null
    phone?: string | null
    name?: string | null
    isMaster?: boolean
    groupCount?: number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    masters?: ZaloAccountRelationUncheckedCreateNestedManyWithoutChildInput
    children?: ZaloAccountRelationUncheckedCreateNestedManyWithoutMasterInput
    groupMaps?: ZaloAccountGroupUncheckedCreateNestedManyWithoutZaloAccountInput
    friends?: ZaloAccountFriendUncheckedCreateNestedManyWithoutMasterInput
    friendOf?: ZaloAccountFriendUncheckedCreateNestedManyWithoutFriendInput
  }

  export type ZaloAccountCreateOrConnectWithoutMessagesInput = {
    where: ZaloAccountWhereUniqueInput
    create: XOR<ZaloAccountCreateWithoutMessagesInput, ZaloAccountUncheckedCreateWithoutMessagesInput>
  }

  export type ZaloGroupCreateWithoutMessagesInput = {
    id?: string
    groupName: string
    isUpdateName?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accountMaps?: ZaloAccountGroupCreateNestedManyWithoutGroupInput
  }

  export type ZaloGroupUncheckedCreateWithoutMessagesInput = {
    id?: string
    groupName: string
    isUpdateName?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accountMaps?: ZaloAccountGroupUncheckedCreateNestedManyWithoutGroupInput
  }

  export type ZaloGroupCreateOrConnectWithoutMessagesInput = {
    where: ZaloGroupWhereUniqueInput
    create: XOR<ZaloGroupCreateWithoutMessagesInput, ZaloGroupUncheckedCreateWithoutMessagesInput>
  }

  export type ZaloAccountUpsertWithoutMessagesInput = {
    update: XOR<ZaloAccountUpdateWithoutMessagesInput, ZaloAccountUncheckedUpdateWithoutMessagesInput>
    create: XOR<ZaloAccountCreateWithoutMessagesInput, ZaloAccountUncheckedCreateWithoutMessagesInput>
    where?: ZaloAccountWhereInput
  }

  export type ZaloAccountUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ZaloAccountWhereInput
    data: XOR<ZaloAccountUpdateWithoutMessagesInput, ZaloAccountUncheckedUpdateWithoutMessagesInput>
  }

  export type ZaloAccountUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    zaloId?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    groupCount?: IntFieldUpdateOperationsInput | number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    masters?: ZaloAccountRelationUpdateManyWithoutChildNestedInput
    children?: ZaloAccountRelationUpdateManyWithoutMasterNestedInput
    groupMaps?: ZaloAccountGroupUpdateManyWithoutZaloAccountNestedInput
    friends?: ZaloAccountFriendUpdateManyWithoutMasterNestedInput
    friendOf?: ZaloAccountFriendUpdateManyWithoutFriendNestedInput
  }

  export type ZaloAccountUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    zaloId?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    groupCount?: IntFieldUpdateOperationsInput | number
    groupData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    masters?: ZaloAccountRelationUncheckedUpdateManyWithoutChildNestedInput
    children?: ZaloAccountRelationUncheckedUpdateManyWithoutMasterNestedInput
    groupMaps?: ZaloAccountGroupUncheckedUpdateManyWithoutZaloAccountNestedInput
    friends?: ZaloAccountFriendUncheckedUpdateManyWithoutMasterNestedInput
    friendOf?: ZaloAccountFriendUncheckedUpdateManyWithoutFriendNestedInput
  }

  export type ZaloGroupUpsertWithoutMessagesInput = {
    update: XOR<ZaloGroupUpdateWithoutMessagesInput, ZaloGroupUncheckedUpdateWithoutMessagesInput>
    create: XOR<ZaloGroupCreateWithoutMessagesInput, ZaloGroupUncheckedCreateWithoutMessagesInput>
    where?: ZaloGroupWhereInput
  }

  export type ZaloGroupUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ZaloGroupWhereInput
    data: XOR<ZaloGroupUpdateWithoutMessagesInput, ZaloGroupUncheckedUpdateWithoutMessagesInput>
  }

  export type ZaloGroupUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupName?: StringFieldUpdateOperationsInput | string
    isUpdateName?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accountMaps?: ZaloAccountGroupUpdateManyWithoutGroupNestedInput
  }

  export type ZaloGroupUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupName?: StringFieldUpdateOperationsInput | string
    isUpdateName?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accountMaps?: ZaloAccountGroupUncheckedUpdateManyWithoutGroupNestedInput
  }

  export type ZaloAccountGroupCreateManyGroupInput = {
    id?: string
    groupZaloId: string
    zaloAccountId: string
    joinedAt?: Date | string
  }

  export type MessageCreateManyGroupInput = {
    id?: string
    messageZaloId?: string | null
    cliMsgId?: string | null
    uidFrom?: string | null
    content: string
    senderId: string
    sentAt?: Date | string | null
    status: $Enums.MessageStatus
    createdAt?: Date | string
  }

  export type ZaloAccountGroupUpdateWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupZaloId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    zaloAccount?: ZaloAccountUpdateOneRequiredWithoutGroupMapsNestedInput
  }

  export type ZaloAccountGroupUncheckedUpdateWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupZaloId?: StringFieldUpdateOperationsInput | string
    zaloAccountId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountGroupUncheckedUpdateManyWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupZaloId?: StringFieldUpdateOperationsInput | string
    zaloAccountId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUpdateWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageZaloId?: NullableStringFieldUpdateOperationsInput | string | null
    cliMsgId?: NullableStringFieldUpdateOperationsInput | string | null
    uidFrom?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: ZaloAccountUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageZaloId?: NullableStringFieldUpdateOperationsInput | string | null
    cliMsgId?: NullableStringFieldUpdateOperationsInput | string | null
    uidFrom?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageZaloId?: NullableStringFieldUpdateOperationsInput | string | null
    cliMsgId?: NullableStringFieldUpdateOperationsInput | string | null
    uidFrom?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountRelationCreateManyChildInput = {
    id?: string
    masterId: string
    createdAt?: Date | string
  }

  export type ZaloAccountRelationCreateManyMasterInput = {
    id?: string
    childId: string
    createdAt?: Date | string
  }

  export type ZaloAccountGroupCreateManyZaloAccountInput = {
    id?: string
    groupZaloId: string
    groupId: string
    joinedAt?: Date | string
  }

  export type MessageCreateManySenderInput = {
    id?: string
    messageZaloId?: string | null
    cliMsgId?: string | null
    uidFrom?: string | null
    content: string
    groupId: string
    sentAt?: Date | string | null
    status: $Enums.MessageStatus
    createdAt?: Date | string
  }

  export type ZaloAccountFriendCreateManyMasterInput = {
    id?: string
    friendId: string
    status?: $Enums.ZaloAccountFriendStatus
    createdAt?: Date | string
  }

  export type ZaloAccountFriendCreateManyFriendInput = {
    id?: string
    masterId: string
    status?: $Enums.ZaloAccountFriendStatus
    createdAt?: Date | string
  }

  export type ZaloAccountRelationUpdateWithoutChildInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    master?: ZaloAccountUpdateOneRequiredWithoutChildrenNestedInput
  }

  export type ZaloAccountRelationUncheckedUpdateWithoutChildInput = {
    id?: StringFieldUpdateOperationsInput | string
    masterId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountRelationUncheckedUpdateManyWithoutChildInput = {
    id?: StringFieldUpdateOperationsInput | string
    masterId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountRelationUpdateWithoutMasterInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    child?: ZaloAccountUpdateOneRequiredWithoutMastersNestedInput
  }

  export type ZaloAccountRelationUncheckedUpdateWithoutMasterInput = {
    id?: StringFieldUpdateOperationsInput | string
    childId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountRelationUncheckedUpdateManyWithoutMasterInput = {
    id?: StringFieldUpdateOperationsInput | string
    childId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountGroupUpdateWithoutZaloAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupZaloId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    group?: ZaloGroupUpdateOneRequiredWithoutAccountMapsNestedInput
  }

  export type ZaloAccountGroupUncheckedUpdateWithoutZaloAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupZaloId?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountGroupUncheckedUpdateManyWithoutZaloAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupZaloId?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageZaloId?: NullableStringFieldUpdateOperationsInput | string | null
    cliMsgId?: NullableStringFieldUpdateOperationsInput | string | null
    uidFrom?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    group?: ZaloGroupUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageZaloId?: NullableStringFieldUpdateOperationsInput | string | null
    cliMsgId?: NullableStringFieldUpdateOperationsInput | string | null
    uidFrom?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageZaloId?: NullableStringFieldUpdateOperationsInput | string | null
    cliMsgId?: NullableStringFieldUpdateOperationsInput | string | null
    uidFrom?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumMessageStatusFieldUpdateOperationsInput | $Enums.MessageStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountFriendUpdateWithoutMasterInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumZaloAccountFriendStatusFieldUpdateOperationsInput | $Enums.ZaloAccountFriendStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    friend?: ZaloAccountUpdateOneRequiredWithoutFriendOfNestedInput
  }

  export type ZaloAccountFriendUncheckedUpdateWithoutMasterInput = {
    id?: StringFieldUpdateOperationsInput | string
    friendId?: StringFieldUpdateOperationsInput | string
    status?: EnumZaloAccountFriendStatusFieldUpdateOperationsInput | $Enums.ZaloAccountFriendStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountFriendUncheckedUpdateManyWithoutMasterInput = {
    id?: StringFieldUpdateOperationsInput | string
    friendId?: StringFieldUpdateOperationsInput | string
    status?: EnumZaloAccountFriendStatusFieldUpdateOperationsInput | $Enums.ZaloAccountFriendStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountFriendUpdateWithoutFriendInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumZaloAccountFriendStatusFieldUpdateOperationsInput | $Enums.ZaloAccountFriendStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    master?: ZaloAccountUpdateOneRequiredWithoutFriendsNestedInput
  }

  export type ZaloAccountFriendUncheckedUpdateWithoutFriendInput = {
    id?: StringFieldUpdateOperationsInput | string
    masterId?: StringFieldUpdateOperationsInput | string
    status?: EnumZaloAccountFriendStatusFieldUpdateOperationsInput | $Enums.ZaloAccountFriendStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ZaloAccountFriendUncheckedUpdateManyWithoutFriendInput = {
    id?: StringFieldUpdateOperationsInput | string
    masterId?: StringFieldUpdateOperationsInput | string
    status?: EnumZaloAccountFriendStatusFieldUpdateOperationsInput | $Enums.ZaloAccountFriendStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}