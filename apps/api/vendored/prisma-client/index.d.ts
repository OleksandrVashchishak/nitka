
/**
 * Client
**/

import * as runtime from '@prisma/client/runtime/library.js';
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
 * Model PushDevice
 * 
 */
export type PushDevice = $Result.DefaultSelection<Prisma.$PushDevicePayload>
/**
 * Model ExternalVendor
 * 
 */
export type ExternalVendor = $Result.DefaultSelection<Prisma.$ExternalVendorPayload>
/**
 * Model Wedding
 * 
 */
export type Wedding = $Result.DefaultSelection<Prisma.$WeddingPayload>
/**
 * Model WeddingWebsite
 * 
 */
export type WeddingWebsite = $Result.DefaultSelection<Prisma.$WeddingWebsitePayload>
/**
 * Model WeddingInvitation
 * 
 */
export type WeddingInvitation = $Result.DefaultSelection<Prisma.$WeddingInvitationPayload>
/**
 * Model WeddingMember
 * 
 */
export type WeddingMember = $Result.DefaultSelection<Prisma.$WeddingMemberPayload>
/**
 * Model WeddingInvite
 * 
 */
export type WeddingInvite = $Result.DefaultSelection<Prisma.$WeddingInvitePayload>
/**
 * Model Task
 * 
 */
export type Task = $Result.DefaultSelection<Prisma.$TaskPayload>
/**
 * Model Guest
 * 
 */
export type Guest = $Result.DefaultSelection<Prisma.$GuestPayload>
/**
 * Model BudgetItem
 * 
 */
export type BudgetItem = $Result.DefaultSelection<Prisma.$BudgetItemPayload>
/**
 * Model ContentTopic
 * 
 */
export type ContentTopic = $Result.DefaultSelection<Prisma.$ContentTopicPayload>
/**
 * Model ContentPost
 * 
 */
export type ContentPost = $Result.DefaultSelection<Prisma.$ContentPostPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  GUEST: 'GUEST',
  COUPLE: 'COUPLE',
  VENDOR: 'VENDOR',
  ADMIN: 'ADMIN'
};

export type Role = (typeof Role)[keyof typeof Role]


export const RsvpStatus: {
  PENDING: 'PENDING',
  YES: 'YES',
  NO: 'NO',
  MAYBE: 'MAYBE'
};

export type RsvpStatus = (typeof RsvpStatus)[keyof typeof RsvpStatus]


export const GuestSide: {
  BRIDE: 'BRIDE',
  GROOM: 'GROOM',
  BOTH: 'BOTH',
  OTHER: 'OTHER'
};

export type GuestSide = (typeof GuestSide)[keyof typeof GuestSide]


export const VendorPipelineStage: {
  SAVED: 'SAVED',
  CONTACTED: 'CONTACTED',
  MET: 'MET',
  COMPARED: 'COMPARED',
  CHOSEN: 'CHOSEN'
};

export type VendorPipelineStage = (typeof VendorPipelineStage)[keyof typeof VendorPipelineStage]


export const WeddingMemberRole: {
  OWNER: 'OWNER',
  PARTNER: 'PARTNER'
};

export type WeddingMemberRole = (typeof WeddingMemberRole)[keyof typeof WeddingMemberRole]


export const TaskStatus: {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
};

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]


export const ContentKind: {
  ARTICLE: 'ARTICLE',
  GUIDE: 'GUIDE',
  LANDING: 'LANDING'
};

export type ContentKind = (typeof ContentKind)[keyof typeof ContentKind]


export const ContentStatus: {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

export type ContentStatus = (typeof ContentStatus)[keyof typeof ContentStatus]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type RsvpStatus = $Enums.RsvpStatus

export const RsvpStatus: typeof $Enums.RsvpStatus

export type GuestSide = $Enums.GuestSide

export const GuestSide: typeof $Enums.GuestSide

export type VendorPipelineStage = $Enums.VendorPipelineStage

export const VendorPipelineStage: typeof $Enums.VendorPipelineStage

export type WeddingMemberRole = $Enums.WeddingMemberRole

export const WeddingMemberRole: typeof $Enums.WeddingMemberRole

export type TaskStatus = $Enums.TaskStatus

export const TaskStatus: typeof $Enums.TaskStatus

export type ContentKind = $Enums.ContentKind

export const ContentKind: typeof $Enums.ContentKind

export type ContentStatus = $Enums.ContentStatus

export const ContentStatus: typeof $Enums.ContentStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
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
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
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
   * `prisma.pushDevice`: Exposes CRUD operations for the **PushDevice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PushDevices
    * const pushDevices = await prisma.pushDevice.findMany()
    * ```
    */
  get pushDevice(): Prisma.PushDeviceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.externalVendor`: Exposes CRUD operations for the **ExternalVendor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExternalVendors
    * const externalVendors = await prisma.externalVendor.findMany()
    * ```
    */
  get externalVendor(): Prisma.ExternalVendorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.wedding`: Exposes CRUD operations for the **Wedding** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Weddings
    * const weddings = await prisma.wedding.findMany()
    * ```
    */
  get wedding(): Prisma.WeddingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.weddingWebsite`: Exposes CRUD operations for the **WeddingWebsite** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WeddingWebsites
    * const weddingWebsites = await prisma.weddingWebsite.findMany()
    * ```
    */
  get weddingWebsite(): Prisma.WeddingWebsiteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.weddingInvitation`: Exposes CRUD operations for the **WeddingInvitation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WeddingInvitations
    * const weddingInvitations = await prisma.weddingInvitation.findMany()
    * ```
    */
  get weddingInvitation(): Prisma.WeddingInvitationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.weddingMember`: Exposes CRUD operations for the **WeddingMember** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WeddingMembers
    * const weddingMembers = await prisma.weddingMember.findMany()
    * ```
    */
  get weddingMember(): Prisma.WeddingMemberDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.weddingInvite`: Exposes CRUD operations for the **WeddingInvite** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WeddingInvites
    * const weddingInvites = await prisma.weddingInvite.findMany()
    * ```
    */
  get weddingInvite(): Prisma.WeddingInviteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.task`: Exposes CRUD operations for the **Task** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tasks
    * const tasks = await prisma.task.findMany()
    * ```
    */
  get task(): Prisma.TaskDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.guest`: Exposes CRUD operations for the **Guest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Guests
    * const guests = await prisma.guest.findMany()
    * ```
    */
  get guest(): Prisma.GuestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.budgetItem`: Exposes CRUD operations for the **BudgetItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BudgetItems
    * const budgetItems = await prisma.budgetItem.findMany()
    * ```
    */
  get budgetItem(): Prisma.BudgetItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.contentTopic`: Exposes CRUD operations for the **ContentTopic** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ContentTopics
    * const contentTopics = await prisma.contentTopic.findMany()
    * ```
    */
  get contentTopic(): Prisma.ContentTopicDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.contentPost`: Exposes CRUD operations for the **ContentPost** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ContentPosts
    * const contentPosts = await prisma.contentPost.findMany()
    * ```
    */
  get contentPost(): Prisma.ContentPostDelegate<ExtArgs, ClientOptions>;
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
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

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
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
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
    PushDevice: 'PushDevice',
    ExternalVendor: 'ExternalVendor',
    Wedding: 'Wedding',
    WeddingWebsite: 'WeddingWebsite',
    WeddingInvitation: 'WeddingInvitation',
    WeddingMember: 'WeddingMember',
    WeddingInvite: 'WeddingInvite',
    Task: 'Task',
    Guest: 'Guest',
    BudgetItem: 'BudgetItem',
    ContentTopic: 'ContentTopic',
    ContentPost: 'ContentPost'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "pushDevice" | "externalVendor" | "wedding" | "weddingWebsite" | "weddingInvitation" | "weddingMember" | "weddingInvite" | "task" | "guest" | "budgetItem" | "contentTopic" | "contentPost"
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
      PushDevice: {
        payload: Prisma.$PushDevicePayload<ExtArgs>
        fields: Prisma.PushDeviceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PushDeviceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushDevicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PushDeviceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushDevicePayload>
          }
          findFirst: {
            args: Prisma.PushDeviceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushDevicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PushDeviceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushDevicePayload>
          }
          findMany: {
            args: Prisma.PushDeviceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushDevicePayload>[]
          }
          create: {
            args: Prisma.PushDeviceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushDevicePayload>
          }
          createMany: {
            args: Prisma.PushDeviceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PushDeviceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushDevicePayload>[]
          }
          delete: {
            args: Prisma.PushDeviceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushDevicePayload>
          }
          update: {
            args: Prisma.PushDeviceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushDevicePayload>
          }
          deleteMany: {
            args: Prisma.PushDeviceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PushDeviceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PushDeviceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushDevicePayload>[]
          }
          upsert: {
            args: Prisma.PushDeviceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushDevicePayload>
          }
          aggregate: {
            args: Prisma.PushDeviceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePushDevice>
          }
          groupBy: {
            args: Prisma.PushDeviceGroupByArgs<ExtArgs>
            result: $Utils.Optional<PushDeviceGroupByOutputType>[]
          }
          count: {
            args: Prisma.PushDeviceCountArgs<ExtArgs>
            result: $Utils.Optional<PushDeviceCountAggregateOutputType> | number
          }
        }
      }
      ExternalVendor: {
        payload: Prisma.$ExternalVendorPayload<ExtArgs>
        fields: Prisma.ExternalVendorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExternalVendorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExternalVendorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExternalVendorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExternalVendorPayload>
          }
          findFirst: {
            args: Prisma.ExternalVendorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExternalVendorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExternalVendorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExternalVendorPayload>
          }
          findMany: {
            args: Prisma.ExternalVendorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExternalVendorPayload>[]
          }
          create: {
            args: Prisma.ExternalVendorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExternalVendorPayload>
          }
          createMany: {
            args: Prisma.ExternalVendorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExternalVendorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExternalVendorPayload>[]
          }
          delete: {
            args: Prisma.ExternalVendorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExternalVendorPayload>
          }
          update: {
            args: Prisma.ExternalVendorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExternalVendorPayload>
          }
          deleteMany: {
            args: Prisma.ExternalVendorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExternalVendorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExternalVendorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExternalVendorPayload>[]
          }
          upsert: {
            args: Prisma.ExternalVendorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExternalVendorPayload>
          }
          aggregate: {
            args: Prisma.ExternalVendorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExternalVendor>
          }
          groupBy: {
            args: Prisma.ExternalVendorGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExternalVendorGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExternalVendorCountArgs<ExtArgs>
            result: $Utils.Optional<ExternalVendorCountAggregateOutputType> | number
          }
        }
      }
      Wedding: {
        payload: Prisma.$WeddingPayload<ExtArgs>
        fields: Prisma.WeddingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WeddingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WeddingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload>
          }
          findFirst: {
            args: Prisma.WeddingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WeddingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload>
          }
          findMany: {
            args: Prisma.WeddingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload>[]
          }
          create: {
            args: Prisma.WeddingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload>
          }
          createMany: {
            args: Prisma.WeddingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WeddingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload>[]
          }
          delete: {
            args: Prisma.WeddingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload>
          }
          update: {
            args: Prisma.WeddingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload>
          }
          deleteMany: {
            args: Prisma.WeddingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WeddingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WeddingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload>[]
          }
          upsert: {
            args: Prisma.WeddingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingPayload>
          }
          aggregate: {
            args: Prisma.WeddingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWedding>
          }
          groupBy: {
            args: Prisma.WeddingGroupByArgs<ExtArgs>
            result: $Utils.Optional<WeddingGroupByOutputType>[]
          }
          count: {
            args: Prisma.WeddingCountArgs<ExtArgs>
            result: $Utils.Optional<WeddingCountAggregateOutputType> | number
          }
        }
      }
      WeddingWebsite: {
        payload: Prisma.$WeddingWebsitePayload<ExtArgs>
        fields: Prisma.WeddingWebsiteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WeddingWebsiteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingWebsitePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WeddingWebsiteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingWebsitePayload>
          }
          findFirst: {
            args: Prisma.WeddingWebsiteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingWebsitePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WeddingWebsiteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingWebsitePayload>
          }
          findMany: {
            args: Prisma.WeddingWebsiteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingWebsitePayload>[]
          }
          create: {
            args: Prisma.WeddingWebsiteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingWebsitePayload>
          }
          createMany: {
            args: Prisma.WeddingWebsiteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WeddingWebsiteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingWebsitePayload>[]
          }
          delete: {
            args: Prisma.WeddingWebsiteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingWebsitePayload>
          }
          update: {
            args: Prisma.WeddingWebsiteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingWebsitePayload>
          }
          deleteMany: {
            args: Prisma.WeddingWebsiteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WeddingWebsiteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WeddingWebsiteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingWebsitePayload>[]
          }
          upsert: {
            args: Prisma.WeddingWebsiteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingWebsitePayload>
          }
          aggregate: {
            args: Prisma.WeddingWebsiteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWeddingWebsite>
          }
          groupBy: {
            args: Prisma.WeddingWebsiteGroupByArgs<ExtArgs>
            result: $Utils.Optional<WeddingWebsiteGroupByOutputType>[]
          }
          count: {
            args: Prisma.WeddingWebsiteCountArgs<ExtArgs>
            result: $Utils.Optional<WeddingWebsiteCountAggregateOutputType> | number
          }
        }
      }
      WeddingInvitation: {
        payload: Prisma.$WeddingInvitationPayload<ExtArgs>
        fields: Prisma.WeddingInvitationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WeddingInvitationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WeddingInvitationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitationPayload>
          }
          findFirst: {
            args: Prisma.WeddingInvitationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WeddingInvitationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitationPayload>
          }
          findMany: {
            args: Prisma.WeddingInvitationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitationPayload>[]
          }
          create: {
            args: Prisma.WeddingInvitationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitationPayload>
          }
          createMany: {
            args: Prisma.WeddingInvitationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WeddingInvitationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitationPayload>[]
          }
          delete: {
            args: Prisma.WeddingInvitationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitationPayload>
          }
          update: {
            args: Prisma.WeddingInvitationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitationPayload>
          }
          deleteMany: {
            args: Prisma.WeddingInvitationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WeddingInvitationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WeddingInvitationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitationPayload>[]
          }
          upsert: {
            args: Prisma.WeddingInvitationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitationPayload>
          }
          aggregate: {
            args: Prisma.WeddingInvitationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWeddingInvitation>
          }
          groupBy: {
            args: Prisma.WeddingInvitationGroupByArgs<ExtArgs>
            result: $Utils.Optional<WeddingInvitationGroupByOutputType>[]
          }
          count: {
            args: Prisma.WeddingInvitationCountArgs<ExtArgs>
            result: $Utils.Optional<WeddingInvitationCountAggregateOutputType> | number
          }
        }
      }
      WeddingMember: {
        payload: Prisma.$WeddingMemberPayload<ExtArgs>
        fields: Prisma.WeddingMemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WeddingMemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingMemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WeddingMemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingMemberPayload>
          }
          findFirst: {
            args: Prisma.WeddingMemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingMemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WeddingMemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingMemberPayload>
          }
          findMany: {
            args: Prisma.WeddingMemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingMemberPayload>[]
          }
          create: {
            args: Prisma.WeddingMemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingMemberPayload>
          }
          createMany: {
            args: Prisma.WeddingMemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WeddingMemberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingMemberPayload>[]
          }
          delete: {
            args: Prisma.WeddingMemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingMemberPayload>
          }
          update: {
            args: Prisma.WeddingMemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingMemberPayload>
          }
          deleteMany: {
            args: Prisma.WeddingMemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WeddingMemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WeddingMemberUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingMemberPayload>[]
          }
          upsert: {
            args: Prisma.WeddingMemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingMemberPayload>
          }
          aggregate: {
            args: Prisma.WeddingMemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWeddingMember>
          }
          groupBy: {
            args: Prisma.WeddingMemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<WeddingMemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.WeddingMemberCountArgs<ExtArgs>
            result: $Utils.Optional<WeddingMemberCountAggregateOutputType> | number
          }
        }
      }
      WeddingInvite: {
        payload: Prisma.$WeddingInvitePayload<ExtArgs>
        fields: Prisma.WeddingInviteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WeddingInviteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WeddingInviteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitePayload>
          }
          findFirst: {
            args: Prisma.WeddingInviteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WeddingInviteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitePayload>
          }
          findMany: {
            args: Prisma.WeddingInviteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitePayload>[]
          }
          create: {
            args: Prisma.WeddingInviteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitePayload>
          }
          createMany: {
            args: Prisma.WeddingInviteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WeddingInviteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitePayload>[]
          }
          delete: {
            args: Prisma.WeddingInviteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitePayload>
          }
          update: {
            args: Prisma.WeddingInviteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitePayload>
          }
          deleteMany: {
            args: Prisma.WeddingInviteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WeddingInviteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WeddingInviteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitePayload>[]
          }
          upsert: {
            args: Prisma.WeddingInviteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeddingInvitePayload>
          }
          aggregate: {
            args: Prisma.WeddingInviteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWeddingInvite>
          }
          groupBy: {
            args: Prisma.WeddingInviteGroupByArgs<ExtArgs>
            result: $Utils.Optional<WeddingInviteGroupByOutputType>[]
          }
          count: {
            args: Prisma.WeddingInviteCountArgs<ExtArgs>
            result: $Utils.Optional<WeddingInviteCountAggregateOutputType> | number
          }
        }
      }
      Task: {
        payload: Prisma.$TaskPayload<ExtArgs>
        fields: Prisma.TaskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findFirst: {
            args: Prisma.TaskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findMany: {
            args: Prisma.TaskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          create: {
            args: Prisma.TaskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          createMany: {
            args: Prisma.TaskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          delete: {
            args: Prisma.TaskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          update: {
            args: Prisma.TaskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          deleteMany: {
            args: Prisma.TaskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TaskUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          upsert: {
            args: Prisma.TaskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          aggregate: {
            args: Prisma.TaskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTask>
          }
          groupBy: {
            args: Prisma.TaskGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskCountArgs<ExtArgs>
            result: $Utils.Optional<TaskCountAggregateOutputType> | number
          }
        }
      }
      Guest: {
        payload: Prisma.$GuestPayload<ExtArgs>
        fields: Prisma.GuestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GuestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GuestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestPayload>
          }
          findFirst: {
            args: Prisma.GuestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GuestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestPayload>
          }
          findMany: {
            args: Prisma.GuestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestPayload>[]
          }
          create: {
            args: Prisma.GuestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestPayload>
          }
          createMany: {
            args: Prisma.GuestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GuestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestPayload>[]
          }
          delete: {
            args: Prisma.GuestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestPayload>
          }
          update: {
            args: Prisma.GuestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestPayload>
          }
          deleteMany: {
            args: Prisma.GuestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GuestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GuestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestPayload>[]
          }
          upsert: {
            args: Prisma.GuestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestPayload>
          }
          aggregate: {
            args: Prisma.GuestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGuest>
          }
          groupBy: {
            args: Prisma.GuestGroupByArgs<ExtArgs>
            result: $Utils.Optional<GuestGroupByOutputType>[]
          }
          count: {
            args: Prisma.GuestCountArgs<ExtArgs>
            result: $Utils.Optional<GuestCountAggregateOutputType> | number
          }
        }
      }
      BudgetItem: {
        payload: Prisma.$BudgetItemPayload<ExtArgs>
        fields: Prisma.BudgetItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BudgetItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BudgetItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetItemPayload>
          }
          findFirst: {
            args: Prisma.BudgetItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BudgetItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetItemPayload>
          }
          findMany: {
            args: Prisma.BudgetItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetItemPayload>[]
          }
          create: {
            args: Prisma.BudgetItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetItemPayload>
          }
          createMany: {
            args: Prisma.BudgetItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BudgetItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetItemPayload>[]
          }
          delete: {
            args: Prisma.BudgetItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetItemPayload>
          }
          update: {
            args: Prisma.BudgetItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetItemPayload>
          }
          deleteMany: {
            args: Prisma.BudgetItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BudgetItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BudgetItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetItemPayload>[]
          }
          upsert: {
            args: Prisma.BudgetItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetItemPayload>
          }
          aggregate: {
            args: Prisma.BudgetItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBudgetItem>
          }
          groupBy: {
            args: Prisma.BudgetItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<BudgetItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.BudgetItemCountArgs<ExtArgs>
            result: $Utils.Optional<BudgetItemCountAggregateOutputType> | number
          }
        }
      }
      ContentTopic: {
        payload: Prisma.$ContentTopicPayload<ExtArgs>
        fields: Prisma.ContentTopicFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContentTopicFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTopicPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContentTopicFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTopicPayload>
          }
          findFirst: {
            args: Prisma.ContentTopicFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTopicPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContentTopicFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTopicPayload>
          }
          findMany: {
            args: Prisma.ContentTopicFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTopicPayload>[]
          }
          create: {
            args: Prisma.ContentTopicCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTopicPayload>
          }
          createMany: {
            args: Prisma.ContentTopicCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ContentTopicCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTopicPayload>[]
          }
          delete: {
            args: Prisma.ContentTopicDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTopicPayload>
          }
          update: {
            args: Prisma.ContentTopicUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTopicPayload>
          }
          deleteMany: {
            args: Prisma.ContentTopicDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContentTopicUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ContentTopicUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTopicPayload>[]
          }
          upsert: {
            args: Prisma.ContentTopicUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTopicPayload>
          }
          aggregate: {
            args: Prisma.ContentTopicAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContentTopic>
          }
          groupBy: {
            args: Prisma.ContentTopicGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContentTopicGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContentTopicCountArgs<ExtArgs>
            result: $Utils.Optional<ContentTopicCountAggregateOutputType> | number
          }
        }
      }
      ContentPost: {
        payload: Prisma.$ContentPostPayload<ExtArgs>
        fields: Prisma.ContentPostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContentPostFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContentPostFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPostPayload>
          }
          findFirst: {
            args: Prisma.ContentPostFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContentPostFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPostPayload>
          }
          findMany: {
            args: Prisma.ContentPostFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPostPayload>[]
          }
          create: {
            args: Prisma.ContentPostCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPostPayload>
          }
          createMany: {
            args: Prisma.ContentPostCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ContentPostCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPostPayload>[]
          }
          delete: {
            args: Prisma.ContentPostDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPostPayload>
          }
          update: {
            args: Prisma.ContentPostUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPostPayload>
          }
          deleteMany: {
            args: Prisma.ContentPostDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContentPostUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ContentPostUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPostPayload>[]
          }
          upsert: {
            args: Prisma.ContentPostUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentPostPayload>
          }
          aggregate: {
            args: Prisma.ContentPostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContentPost>
          }
          groupBy: {
            args: Prisma.ContentPostGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContentPostGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContentPostCountArgs<ExtArgs>
            result: $Utils.Optional<ContentPostCountAggregateOutputType> | number
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
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
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
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
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
    adapter?: runtime.SqlDriverAdapterFactory | null
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
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    pushDevice?: PushDeviceOmit
    externalVendor?: ExternalVendorOmit
    wedding?: WeddingOmit
    weddingWebsite?: WeddingWebsiteOmit
    weddingInvitation?: WeddingInvitationOmit
    weddingMember?: WeddingMemberOmit
    weddingInvite?: WeddingInviteOmit
    task?: TaskOmit
    guest?: GuestOmit
    budgetItem?: BudgetItemOmit
    contentTopic?: ContentTopicOmit
    contentPost?: ContentPostOmit
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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    externalVendors: number
    contentPosts: number
    pushDevices: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    externalVendors?: boolean | UserCountOutputTypeCountExternalVendorsArgs
    contentPosts?: boolean | UserCountOutputTypeCountContentPostsArgs
    pushDevices?: boolean | UserCountOutputTypeCountPushDevicesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountExternalVendorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExternalVendorWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountContentPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContentPostWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPushDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PushDeviceWhereInput
  }


  /**
   * Count Type WeddingCountOutputType
   */

  export type WeddingCountOutputType = {
    members: number
    invites: number
    tasks: number
    guestList: number
    budgetItems: number
  }

  export type WeddingCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | WeddingCountOutputTypeCountMembersArgs
    invites?: boolean | WeddingCountOutputTypeCountInvitesArgs
    tasks?: boolean | WeddingCountOutputTypeCountTasksArgs
    guestList?: boolean | WeddingCountOutputTypeCountGuestListArgs
    budgetItems?: boolean | WeddingCountOutputTypeCountBudgetItemsArgs
  }

  // Custom InputTypes
  /**
   * WeddingCountOutputType without action
   */
  export type WeddingCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingCountOutputType
     */
    select?: WeddingCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WeddingCountOutputType without action
   */
  export type WeddingCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeddingMemberWhereInput
  }

  /**
   * WeddingCountOutputType without action
   */
  export type WeddingCountOutputTypeCountInvitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeddingInviteWhereInput
  }

  /**
   * WeddingCountOutputType without action
   */
  export type WeddingCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * WeddingCountOutputType without action
   */
  export type WeddingCountOutputTypeCountGuestListArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuestWhereInput
  }

  /**
   * WeddingCountOutputType without action
   */
  export type WeddingCountOutputTypeCountBudgetItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BudgetItemWhereInput
  }


  /**
   * Count Type ContentTopicCountOutputType
   */

  export type ContentTopicCountOutputType = {
    posts: number
  }

  export type ContentTopicCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    posts?: boolean | ContentTopicCountOutputTypeCountPostsArgs
  }

  // Custom InputTypes
  /**
   * ContentTopicCountOutputType without action
   */
  export type ContentTopicCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentTopicCountOutputType
     */
    select?: ContentTopicCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ContentTopicCountOutputType without action
   */
  export type ContentTopicCountOutputTypeCountPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContentPostWhereInput
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
    name: string | null
    role: $Enums.Role | null
    blocked: boolean | null
    refreshTokenHash: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    role: $Enums.Role | null
    blocked: boolean | null
    refreshTokenHash: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    name: number
    role: number
    blocked: number
    refreshTokenHash: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    blocked?: true
    refreshTokenHash?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    blocked?: true
    refreshTokenHash?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    blocked?: true
    refreshTokenHash?: true
    createdAt?: true
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
    name: string
    role: $Enums.Role
    blocked: boolean
    refreshTokenHash: string | null
    createdAt: Date
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
    name?: boolean
    role?: boolean
    blocked?: boolean
    refreshTokenHash?: boolean
    createdAt?: boolean
    wedding?: boolean | User$weddingArgs<ExtArgs>
    weddingMember?: boolean | User$weddingMemberArgs<ExtArgs>
    externalVendors?: boolean | User$externalVendorsArgs<ExtArgs>
    contentPosts?: boolean | User$contentPostsArgs<ExtArgs>
    pushDevices?: boolean | User$pushDevicesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    blocked?: boolean
    refreshTokenHash?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    blocked?: boolean
    refreshTokenHash?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    blocked?: boolean
    refreshTokenHash?: boolean
    createdAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "name" | "role" | "blocked" | "refreshTokenHash" | "createdAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | User$weddingArgs<ExtArgs>
    weddingMember?: boolean | User$weddingMemberArgs<ExtArgs>
    externalVendors?: boolean | User$externalVendorsArgs<ExtArgs>
    contentPosts?: boolean | User$contentPostsArgs<ExtArgs>
    pushDevices?: boolean | User$pushDevicesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      wedding: Prisma.$WeddingPayload<ExtArgs> | null
      weddingMember: Prisma.$WeddingMemberPayload<ExtArgs> | null
      externalVendors: Prisma.$ExternalVendorPayload<ExtArgs>[]
      contentPosts: Prisma.$ContentPostPayload<ExtArgs>[]
      pushDevices: Prisma.$PushDevicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      name: string
      role: $Enums.Role
      blocked: boolean
      refreshTokenHash: string | null
      createdAt: Date
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
    wedding<T extends User$weddingArgs<ExtArgs> = {}>(args?: Subset<T, User$weddingArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    weddingMember<T extends User$weddingMemberArgs<ExtArgs> = {}>(args?: Subset<T, User$weddingMemberArgs<ExtArgs>>): Prisma__WeddingMemberClient<$Result.GetResult<Prisma.$WeddingMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    externalVendors<T extends User$externalVendorsArgs<ExtArgs> = {}>(args?: Subset<T, User$externalVendorsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExternalVendorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    contentPosts<T extends User$contentPostsArgs<ExtArgs> = {}>(args?: Subset<T, User$contentPostsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentPostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pushDevices<T extends User$pushDevicesArgs<ExtArgs> = {}>(args?: Subset<T, User$pushDevicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PushDevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly name: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly blocked: FieldRef<"User", 'Boolean'>
    readonly refreshTokenHash: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
   * User.wedding
   */
  export type User$weddingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wedding
     */
    omit?: WeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    where?: WeddingWhereInput
  }

  /**
   * User.weddingMember
   */
  export type User$weddingMemberArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingMember
     */
    select?: WeddingMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingMember
     */
    omit?: WeddingMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingMemberInclude<ExtArgs> | null
    where?: WeddingMemberWhereInput
  }

  /**
   * User.externalVendors
   */
  export type User$externalVendorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExternalVendor
     */
    select?: ExternalVendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExternalVendor
     */
    omit?: ExternalVendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExternalVendorInclude<ExtArgs> | null
    where?: ExternalVendorWhereInput
    orderBy?: ExternalVendorOrderByWithRelationInput | ExternalVendorOrderByWithRelationInput[]
    cursor?: ExternalVendorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExternalVendorScalarFieldEnum | ExternalVendorScalarFieldEnum[]
  }

  /**
   * User.contentPosts
   */
  export type User$contentPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentPost
     */
    select?: ContentPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentPost
     */
    omit?: ContentPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentPostInclude<ExtArgs> | null
    where?: ContentPostWhereInput
    orderBy?: ContentPostOrderByWithRelationInput | ContentPostOrderByWithRelationInput[]
    cursor?: ContentPostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ContentPostScalarFieldEnum | ContentPostScalarFieldEnum[]
  }

  /**
   * User.pushDevices
   */
  export type User$pushDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushDevice
     */
    select?: PushDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushDevice
     */
    omit?: PushDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushDeviceInclude<ExtArgs> | null
    where?: PushDeviceWhereInput
    orderBy?: PushDeviceOrderByWithRelationInput | PushDeviceOrderByWithRelationInput[]
    cursor?: PushDeviceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PushDeviceScalarFieldEnum | PushDeviceScalarFieldEnum[]
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model PushDevice
   */

  export type AggregatePushDevice = {
    _count: PushDeviceCountAggregateOutputType | null
    _min: PushDeviceMinAggregateOutputType | null
    _max: PushDeviceMaxAggregateOutputType | null
  }

  export type PushDeviceMinAggregateOutputType = {
    id: string | null
    userId: string | null
    token: string | null
    platform: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PushDeviceMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    token: string | null
    platform: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PushDeviceCountAggregateOutputType = {
    id: number
    userId: number
    token: number
    platform: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PushDeviceMinAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    platform?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PushDeviceMaxAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    platform?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PushDeviceCountAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    platform?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PushDeviceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PushDevice to aggregate.
     */
    where?: PushDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PushDevices to fetch.
     */
    orderBy?: PushDeviceOrderByWithRelationInput | PushDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PushDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PushDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PushDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PushDevices
    **/
    _count?: true | PushDeviceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PushDeviceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PushDeviceMaxAggregateInputType
  }

  export type GetPushDeviceAggregateType<T extends PushDeviceAggregateArgs> = {
        [P in keyof T & keyof AggregatePushDevice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePushDevice[P]>
      : GetScalarType<T[P], AggregatePushDevice[P]>
  }




  export type PushDeviceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PushDeviceWhereInput
    orderBy?: PushDeviceOrderByWithAggregationInput | PushDeviceOrderByWithAggregationInput[]
    by: PushDeviceScalarFieldEnum[] | PushDeviceScalarFieldEnum
    having?: PushDeviceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PushDeviceCountAggregateInputType | true
    _min?: PushDeviceMinAggregateInputType
    _max?: PushDeviceMaxAggregateInputType
  }

  export type PushDeviceGroupByOutputType = {
    id: string
    userId: string
    token: string
    platform: string
    createdAt: Date
    updatedAt: Date
    _count: PushDeviceCountAggregateOutputType | null
    _min: PushDeviceMinAggregateOutputType | null
    _max: PushDeviceMaxAggregateOutputType | null
  }

  type GetPushDeviceGroupByPayload<T extends PushDeviceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PushDeviceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PushDeviceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PushDeviceGroupByOutputType[P]>
            : GetScalarType<T[P], PushDeviceGroupByOutputType[P]>
        }
      >
    >


  export type PushDeviceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    platform?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pushDevice"]>

  export type PushDeviceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    platform?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pushDevice"]>

  export type PushDeviceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    platform?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pushDevice"]>

  export type PushDeviceSelectScalar = {
    id?: boolean
    userId?: boolean
    token?: boolean
    platform?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PushDeviceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "token" | "platform" | "createdAt" | "updatedAt", ExtArgs["result"]["pushDevice"]>
  export type PushDeviceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PushDeviceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PushDeviceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PushDevicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PushDevice"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      token: string
      platform: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["pushDevice"]>
    composites: {}
  }

  type PushDeviceGetPayload<S extends boolean | null | undefined | PushDeviceDefaultArgs> = $Result.GetResult<Prisma.$PushDevicePayload, S>

  type PushDeviceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PushDeviceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PushDeviceCountAggregateInputType | true
    }

  export interface PushDeviceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PushDevice'], meta: { name: 'PushDevice' } }
    /**
     * Find zero or one PushDevice that matches the filter.
     * @param {PushDeviceFindUniqueArgs} args - Arguments to find a PushDevice
     * @example
     * // Get one PushDevice
     * const pushDevice = await prisma.pushDevice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PushDeviceFindUniqueArgs>(args: SelectSubset<T, PushDeviceFindUniqueArgs<ExtArgs>>): Prisma__PushDeviceClient<$Result.GetResult<Prisma.$PushDevicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PushDevice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PushDeviceFindUniqueOrThrowArgs} args - Arguments to find a PushDevice
     * @example
     * // Get one PushDevice
     * const pushDevice = await prisma.pushDevice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PushDeviceFindUniqueOrThrowArgs>(args: SelectSubset<T, PushDeviceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PushDeviceClient<$Result.GetResult<Prisma.$PushDevicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PushDevice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushDeviceFindFirstArgs} args - Arguments to find a PushDevice
     * @example
     * // Get one PushDevice
     * const pushDevice = await prisma.pushDevice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PushDeviceFindFirstArgs>(args?: SelectSubset<T, PushDeviceFindFirstArgs<ExtArgs>>): Prisma__PushDeviceClient<$Result.GetResult<Prisma.$PushDevicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PushDevice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushDeviceFindFirstOrThrowArgs} args - Arguments to find a PushDevice
     * @example
     * // Get one PushDevice
     * const pushDevice = await prisma.pushDevice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PushDeviceFindFirstOrThrowArgs>(args?: SelectSubset<T, PushDeviceFindFirstOrThrowArgs<ExtArgs>>): Prisma__PushDeviceClient<$Result.GetResult<Prisma.$PushDevicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PushDevices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushDeviceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PushDevices
     * const pushDevices = await prisma.pushDevice.findMany()
     * 
     * // Get first 10 PushDevices
     * const pushDevices = await prisma.pushDevice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pushDeviceWithIdOnly = await prisma.pushDevice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PushDeviceFindManyArgs>(args?: SelectSubset<T, PushDeviceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PushDevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PushDevice.
     * @param {PushDeviceCreateArgs} args - Arguments to create a PushDevice.
     * @example
     * // Create one PushDevice
     * const PushDevice = await prisma.pushDevice.create({
     *   data: {
     *     // ... data to create a PushDevice
     *   }
     * })
     * 
     */
    create<T extends PushDeviceCreateArgs>(args: SelectSubset<T, PushDeviceCreateArgs<ExtArgs>>): Prisma__PushDeviceClient<$Result.GetResult<Prisma.$PushDevicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PushDevices.
     * @param {PushDeviceCreateManyArgs} args - Arguments to create many PushDevices.
     * @example
     * // Create many PushDevices
     * const pushDevice = await prisma.pushDevice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PushDeviceCreateManyArgs>(args?: SelectSubset<T, PushDeviceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PushDevices and returns the data saved in the database.
     * @param {PushDeviceCreateManyAndReturnArgs} args - Arguments to create many PushDevices.
     * @example
     * // Create many PushDevices
     * const pushDevice = await prisma.pushDevice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PushDevices and only return the `id`
     * const pushDeviceWithIdOnly = await prisma.pushDevice.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PushDeviceCreateManyAndReturnArgs>(args?: SelectSubset<T, PushDeviceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PushDevicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PushDevice.
     * @param {PushDeviceDeleteArgs} args - Arguments to delete one PushDevice.
     * @example
     * // Delete one PushDevice
     * const PushDevice = await prisma.pushDevice.delete({
     *   where: {
     *     // ... filter to delete one PushDevice
     *   }
     * })
     * 
     */
    delete<T extends PushDeviceDeleteArgs>(args: SelectSubset<T, PushDeviceDeleteArgs<ExtArgs>>): Prisma__PushDeviceClient<$Result.GetResult<Prisma.$PushDevicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PushDevice.
     * @param {PushDeviceUpdateArgs} args - Arguments to update one PushDevice.
     * @example
     * // Update one PushDevice
     * const pushDevice = await prisma.pushDevice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PushDeviceUpdateArgs>(args: SelectSubset<T, PushDeviceUpdateArgs<ExtArgs>>): Prisma__PushDeviceClient<$Result.GetResult<Prisma.$PushDevicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PushDevices.
     * @param {PushDeviceDeleteManyArgs} args - Arguments to filter PushDevices to delete.
     * @example
     * // Delete a few PushDevices
     * const { count } = await prisma.pushDevice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PushDeviceDeleteManyArgs>(args?: SelectSubset<T, PushDeviceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PushDevices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushDeviceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PushDevices
     * const pushDevice = await prisma.pushDevice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PushDeviceUpdateManyArgs>(args: SelectSubset<T, PushDeviceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PushDevices and returns the data updated in the database.
     * @param {PushDeviceUpdateManyAndReturnArgs} args - Arguments to update many PushDevices.
     * @example
     * // Update many PushDevices
     * const pushDevice = await prisma.pushDevice.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PushDevices and only return the `id`
     * const pushDeviceWithIdOnly = await prisma.pushDevice.updateManyAndReturn({
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
    updateManyAndReturn<T extends PushDeviceUpdateManyAndReturnArgs>(args: SelectSubset<T, PushDeviceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PushDevicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PushDevice.
     * @param {PushDeviceUpsertArgs} args - Arguments to update or create a PushDevice.
     * @example
     * // Update or create a PushDevice
     * const pushDevice = await prisma.pushDevice.upsert({
     *   create: {
     *     // ... data to create a PushDevice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PushDevice we want to update
     *   }
     * })
     */
    upsert<T extends PushDeviceUpsertArgs>(args: SelectSubset<T, PushDeviceUpsertArgs<ExtArgs>>): Prisma__PushDeviceClient<$Result.GetResult<Prisma.$PushDevicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PushDevices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushDeviceCountArgs} args - Arguments to filter PushDevices to count.
     * @example
     * // Count the number of PushDevices
     * const count = await prisma.pushDevice.count({
     *   where: {
     *     // ... the filter for the PushDevices we want to count
     *   }
     * })
    **/
    count<T extends PushDeviceCountArgs>(
      args?: Subset<T, PushDeviceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PushDeviceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PushDevice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushDeviceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PushDeviceAggregateArgs>(args: Subset<T, PushDeviceAggregateArgs>): Prisma.PrismaPromise<GetPushDeviceAggregateType<T>>

    /**
     * Group by PushDevice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushDeviceGroupByArgs} args - Group by arguments.
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
      T extends PushDeviceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PushDeviceGroupByArgs['orderBy'] }
        : { orderBy?: PushDeviceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PushDeviceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPushDeviceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PushDevice model
   */
  readonly fields: PushDeviceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PushDevice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PushDeviceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the PushDevice model
   */
  interface PushDeviceFieldRefs {
    readonly id: FieldRef<"PushDevice", 'String'>
    readonly userId: FieldRef<"PushDevice", 'String'>
    readonly token: FieldRef<"PushDevice", 'String'>
    readonly platform: FieldRef<"PushDevice", 'String'>
    readonly createdAt: FieldRef<"PushDevice", 'DateTime'>
    readonly updatedAt: FieldRef<"PushDevice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PushDevice findUnique
   */
  export type PushDeviceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushDevice
     */
    select?: PushDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushDevice
     */
    omit?: PushDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushDeviceInclude<ExtArgs> | null
    /**
     * Filter, which PushDevice to fetch.
     */
    where: PushDeviceWhereUniqueInput
  }

  /**
   * PushDevice findUniqueOrThrow
   */
  export type PushDeviceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushDevice
     */
    select?: PushDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushDevice
     */
    omit?: PushDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushDeviceInclude<ExtArgs> | null
    /**
     * Filter, which PushDevice to fetch.
     */
    where: PushDeviceWhereUniqueInput
  }

  /**
   * PushDevice findFirst
   */
  export type PushDeviceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushDevice
     */
    select?: PushDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushDevice
     */
    omit?: PushDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushDeviceInclude<ExtArgs> | null
    /**
     * Filter, which PushDevice to fetch.
     */
    where?: PushDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PushDevices to fetch.
     */
    orderBy?: PushDeviceOrderByWithRelationInput | PushDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PushDevices.
     */
    cursor?: PushDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PushDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PushDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PushDevices.
     */
    distinct?: PushDeviceScalarFieldEnum | PushDeviceScalarFieldEnum[]
  }

  /**
   * PushDevice findFirstOrThrow
   */
  export type PushDeviceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushDevice
     */
    select?: PushDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushDevice
     */
    omit?: PushDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushDeviceInclude<ExtArgs> | null
    /**
     * Filter, which PushDevice to fetch.
     */
    where?: PushDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PushDevices to fetch.
     */
    orderBy?: PushDeviceOrderByWithRelationInput | PushDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PushDevices.
     */
    cursor?: PushDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PushDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PushDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PushDevices.
     */
    distinct?: PushDeviceScalarFieldEnum | PushDeviceScalarFieldEnum[]
  }

  /**
   * PushDevice findMany
   */
  export type PushDeviceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushDevice
     */
    select?: PushDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushDevice
     */
    omit?: PushDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushDeviceInclude<ExtArgs> | null
    /**
     * Filter, which PushDevices to fetch.
     */
    where?: PushDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PushDevices to fetch.
     */
    orderBy?: PushDeviceOrderByWithRelationInput | PushDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PushDevices.
     */
    cursor?: PushDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PushDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PushDevices.
     */
    skip?: number
    distinct?: PushDeviceScalarFieldEnum | PushDeviceScalarFieldEnum[]
  }

  /**
   * PushDevice create
   */
  export type PushDeviceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushDevice
     */
    select?: PushDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushDevice
     */
    omit?: PushDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushDeviceInclude<ExtArgs> | null
    /**
     * The data needed to create a PushDevice.
     */
    data: XOR<PushDeviceCreateInput, PushDeviceUncheckedCreateInput>
  }

  /**
   * PushDevice createMany
   */
  export type PushDeviceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PushDevices.
     */
    data: PushDeviceCreateManyInput | PushDeviceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PushDevice createManyAndReturn
   */
  export type PushDeviceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushDevice
     */
    select?: PushDeviceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PushDevice
     */
    omit?: PushDeviceOmit<ExtArgs> | null
    /**
     * The data used to create many PushDevices.
     */
    data: PushDeviceCreateManyInput | PushDeviceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushDeviceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PushDevice update
   */
  export type PushDeviceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushDevice
     */
    select?: PushDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushDevice
     */
    omit?: PushDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushDeviceInclude<ExtArgs> | null
    /**
     * The data needed to update a PushDevice.
     */
    data: XOR<PushDeviceUpdateInput, PushDeviceUncheckedUpdateInput>
    /**
     * Choose, which PushDevice to update.
     */
    where: PushDeviceWhereUniqueInput
  }

  /**
   * PushDevice updateMany
   */
  export type PushDeviceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PushDevices.
     */
    data: XOR<PushDeviceUpdateManyMutationInput, PushDeviceUncheckedUpdateManyInput>
    /**
     * Filter which PushDevices to update
     */
    where?: PushDeviceWhereInput
    /**
     * Limit how many PushDevices to update.
     */
    limit?: number
  }

  /**
   * PushDevice updateManyAndReturn
   */
  export type PushDeviceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushDevice
     */
    select?: PushDeviceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PushDevice
     */
    omit?: PushDeviceOmit<ExtArgs> | null
    /**
     * The data used to update PushDevices.
     */
    data: XOR<PushDeviceUpdateManyMutationInput, PushDeviceUncheckedUpdateManyInput>
    /**
     * Filter which PushDevices to update
     */
    where?: PushDeviceWhereInput
    /**
     * Limit how many PushDevices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushDeviceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PushDevice upsert
   */
  export type PushDeviceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushDevice
     */
    select?: PushDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushDevice
     */
    omit?: PushDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushDeviceInclude<ExtArgs> | null
    /**
     * The filter to search for the PushDevice to update in case it exists.
     */
    where: PushDeviceWhereUniqueInput
    /**
     * In case the PushDevice found by the `where` argument doesn't exist, create a new PushDevice with this data.
     */
    create: XOR<PushDeviceCreateInput, PushDeviceUncheckedCreateInput>
    /**
     * In case the PushDevice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PushDeviceUpdateInput, PushDeviceUncheckedUpdateInput>
  }

  /**
   * PushDevice delete
   */
  export type PushDeviceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushDevice
     */
    select?: PushDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushDevice
     */
    omit?: PushDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushDeviceInclude<ExtArgs> | null
    /**
     * Filter which PushDevice to delete.
     */
    where: PushDeviceWhereUniqueInput
  }

  /**
   * PushDevice deleteMany
   */
  export type PushDeviceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PushDevices to delete
     */
    where?: PushDeviceWhereInput
    /**
     * Limit how many PushDevices to delete.
     */
    limit?: number
  }

  /**
   * PushDevice without action
   */
  export type PushDeviceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushDevice
     */
    select?: PushDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PushDevice
     */
    omit?: PushDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushDeviceInclude<ExtArgs> | null
  }


  /**
   * Model ExternalVendor
   */

  export type AggregateExternalVendor = {
    _count: ExternalVendorCountAggregateOutputType | null
    _avg: ExternalVendorAvgAggregateOutputType | null
    _sum: ExternalVendorSumAggregateOutputType | null
    _min: ExternalVendorMinAggregateOutputType | null
    _max: ExternalVendorMaxAggregateOutputType | null
  }

  export type ExternalVendorAvgAggregateOutputType = {
    quotedPrice: number | null
  }

  export type ExternalVendorSumAggregateOutputType = {
    quotedPrice: number | null
  }

  export type ExternalVendorMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    category: string | null
    city: string | null
    phone: string | null
    website: string | null
    quotedPrice: number | null
    notes: string | null
    stage: $Enums.VendorPipelineStage | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExternalVendorMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    category: string | null
    city: string | null
    phone: string | null
    website: string | null
    quotedPrice: number | null
    notes: string | null
    stage: $Enums.VendorPipelineStage | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExternalVendorCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    category: number
    city: number
    phone: number
    website: number
    quotedPrice: number
    notes: number
    stage: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ExternalVendorAvgAggregateInputType = {
    quotedPrice?: true
  }

  export type ExternalVendorSumAggregateInputType = {
    quotedPrice?: true
  }

  export type ExternalVendorMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    category?: true
    city?: true
    phone?: true
    website?: true
    quotedPrice?: true
    notes?: true
    stage?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExternalVendorMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    category?: true
    city?: true
    phone?: true
    website?: true
    quotedPrice?: true
    notes?: true
    stage?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExternalVendorCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    category?: true
    city?: true
    phone?: true
    website?: true
    quotedPrice?: true
    notes?: true
    stage?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ExternalVendorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExternalVendor to aggregate.
     */
    where?: ExternalVendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExternalVendors to fetch.
     */
    orderBy?: ExternalVendorOrderByWithRelationInput | ExternalVendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExternalVendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExternalVendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExternalVendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExternalVendors
    **/
    _count?: true | ExternalVendorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExternalVendorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExternalVendorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExternalVendorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExternalVendorMaxAggregateInputType
  }

  export type GetExternalVendorAggregateType<T extends ExternalVendorAggregateArgs> = {
        [P in keyof T & keyof AggregateExternalVendor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExternalVendor[P]>
      : GetScalarType<T[P], AggregateExternalVendor[P]>
  }




  export type ExternalVendorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExternalVendorWhereInput
    orderBy?: ExternalVendorOrderByWithAggregationInput | ExternalVendorOrderByWithAggregationInput[]
    by: ExternalVendorScalarFieldEnum[] | ExternalVendorScalarFieldEnum
    having?: ExternalVendorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExternalVendorCountAggregateInputType | true
    _avg?: ExternalVendorAvgAggregateInputType
    _sum?: ExternalVendorSumAggregateInputType
    _min?: ExternalVendorMinAggregateInputType
    _max?: ExternalVendorMaxAggregateInputType
  }

  export type ExternalVendorGroupByOutputType = {
    id: string
    userId: string
    name: string
    category: string
    city: string
    phone: string | null
    website: string | null
    quotedPrice: number | null
    notes: string | null
    stage: $Enums.VendorPipelineStage
    createdAt: Date
    updatedAt: Date
    _count: ExternalVendorCountAggregateOutputType | null
    _avg: ExternalVendorAvgAggregateOutputType | null
    _sum: ExternalVendorSumAggregateOutputType | null
    _min: ExternalVendorMinAggregateOutputType | null
    _max: ExternalVendorMaxAggregateOutputType | null
  }

  type GetExternalVendorGroupByPayload<T extends ExternalVendorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExternalVendorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExternalVendorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExternalVendorGroupByOutputType[P]>
            : GetScalarType<T[P], ExternalVendorGroupByOutputType[P]>
        }
      >
    >


  export type ExternalVendorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    category?: boolean
    city?: boolean
    phone?: boolean
    website?: boolean
    quotedPrice?: boolean
    notes?: boolean
    stage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    budgetItem?: boolean | ExternalVendor$budgetItemArgs<ExtArgs>
  }, ExtArgs["result"]["externalVendor"]>

  export type ExternalVendorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    category?: boolean
    city?: boolean
    phone?: boolean
    website?: boolean
    quotedPrice?: boolean
    notes?: boolean
    stage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["externalVendor"]>

  export type ExternalVendorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    category?: boolean
    city?: boolean
    phone?: boolean
    website?: boolean
    quotedPrice?: boolean
    notes?: boolean
    stage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["externalVendor"]>

  export type ExternalVendorSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    category?: boolean
    city?: boolean
    phone?: boolean
    website?: boolean
    quotedPrice?: boolean
    notes?: boolean
    stage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ExternalVendorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "name" | "category" | "city" | "phone" | "website" | "quotedPrice" | "notes" | "stage" | "createdAt" | "updatedAt", ExtArgs["result"]["externalVendor"]>
  export type ExternalVendorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    budgetItem?: boolean | ExternalVendor$budgetItemArgs<ExtArgs>
  }
  export type ExternalVendorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ExternalVendorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ExternalVendorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExternalVendor"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      budgetItem: Prisma.$BudgetItemPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      name: string
      category: string
      city: string
      phone: string | null
      website: string | null
      quotedPrice: number | null
      notes: string | null
      stage: $Enums.VendorPipelineStage
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["externalVendor"]>
    composites: {}
  }

  type ExternalVendorGetPayload<S extends boolean | null | undefined | ExternalVendorDefaultArgs> = $Result.GetResult<Prisma.$ExternalVendorPayload, S>

  type ExternalVendorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExternalVendorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExternalVendorCountAggregateInputType | true
    }

  export interface ExternalVendorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExternalVendor'], meta: { name: 'ExternalVendor' } }
    /**
     * Find zero or one ExternalVendor that matches the filter.
     * @param {ExternalVendorFindUniqueArgs} args - Arguments to find a ExternalVendor
     * @example
     * // Get one ExternalVendor
     * const externalVendor = await prisma.externalVendor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExternalVendorFindUniqueArgs>(args: SelectSubset<T, ExternalVendorFindUniqueArgs<ExtArgs>>): Prisma__ExternalVendorClient<$Result.GetResult<Prisma.$ExternalVendorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExternalVendor that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExternalVendorFindUniqueOrThrowArgs} args - Arguments to find a ExternalVendor
     * @example
     * // Get one ExternalVendor
     * const externalVendor = await prisma.externalVendor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExternalVendorFindUniqueOrThrowArgs>(args: SelectSubset<T, ExternalVendorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExternalVendorClient<$Result.GetResult<Prisma.$ExternalVendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExternalVendor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExternalVendorFindFirstArgs} args - Arguments to find a ExternalVendor
     * @example
     * // Get one ExternalVendor
     * const externalVendor = await prisma.externalVendor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExternalVendorFindFirstArgs>(args?: SelectSubset<T, ExternalVendorFindFirstArgs<ExtArgs>>): Prisma__ExternalVendorClient<$Result.GetResult<Prisma.$ExternalVendorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExternalVendor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExternalVendorFindFirstOrThrowArgs} args - Arguments to find a ExternalVendor
     * @example
     * // Get one ExternalVendor
     * const externalVendor = await prisma.externalVendor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExternalVendorFindFirstOrThrowArgs>(args?: SelectSubset<T, ExternalVendorFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExternalVendorClient<$Result.GetResult<Prisma.$ExternalVendorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExternalVendors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExternalVendorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExternalVendors
     * const externalVendors = await prisma.externalVendor.findMany()
     * 
     * // Get first 10 ExternalVendors
     * const externalVendors = await prisma.externalVendor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const externalVendorWithIdOnly = await prisma.externalVendor.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExternalVendorFindManyArgs>(args?: SelectSubset<T, ExternalVendorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExternalVendorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExternalVendor.
     * @param {ExternalVendorCreateArgs} args - Arguments to create a ExternalVendor.
     * @example
     * // Create one ExternalVendor
     * const ExternalVendor = await prisma.externalVendor.create({
     *   data: {
     *     // ... data to create a ExternalVendor
     *   }
     * })
     * 
     */
    create<T extends ExternalVendorCreateArgs>(args: SelectSubset<T, ExternalVendorCreateArgs<ExtArgs>>): Prisma__ExternalVendorClient<$Result.GetResult<Prisma.$ExternalVendorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExternalVendors.
     * @param {ExternalVendorCreateManyArgs} args - Arguments to create many ExternalVendors.
     * @example
     * // Create many ExternalVendors
     * const externalVendor = await prisma.externalVendor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExternalVendorCreateManyArgs>(args?: SelectSubset<T, ExternalVendorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExternalVendors and returns the data saved in the database.
     * @param {ExternalVendorCreateManyAndReturnArgs} args - Arguments to create many ExternalVendors.
     * @example
     * // Create many ExternalVendors
     * const externalVendor = await prisma.externalVendor.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExternalVendors and only return the `id`
     * const externalVendorWithIdOnly = await prisma.externalVendor.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExternalVendorCreateManyAndReturnArgs>(args?: SelectSubset<T, ExternalVendorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExternalVendorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ExternalVendor.
     * @param {ExternalVendorDeleteArgs} args - Arguments to delete one ExternalVendor.
     * @example
     * // Delete one ExternalVendor
     * const ExternalVendor = await prisma.externalVendor.delete({
     *   where: {
     *     // ... filter to delete one ExternalVendor
     *   }
     * })
     * 
     */
    delete<T extends ExternalVendorDeleteArgs>(args: SelectSubset<T, ExternalVendorDeleteArgs<ExtArgs>>): Prisma__ExternalVendorClient<$Result.GetResult<Prisma.$ExternalVendorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExternalVendor.
     * @param {ExternalVendorUpdateArgs} args - Arguments to update one ExternalVendor.
     * @example
     * // Update one ExternalVendor
     * const externalVendor = await prisma.externalVendor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExternalVendorUpdateArgs>(args: SelectSubset<T, ExternalVendorUpdateArgs<ExtArgs>>): Prisma__ExternalVendorClient<$Result.GetResult<Prisma.$ExternalVendorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExternalVendors.
     * @param {ExternalVendorDeleteManyArgs} args - Arguments to filter ExternalVendors to delete.
     * @example
     * // Delete a few ExternalVendors
     * const { count } = await prisma.externalVendor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExternalVendorDeleteManyArgs>(args?: SelectSubset<T, ExternalVendorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExternalVendors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExternalVendorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExternalVendors
     * const externalVendor = await prisma.externalVendor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExternalVendorUpdateManyArgs>(args: SelectSubset<T, ExternalVendorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExternalVendors and returns the data updated in the database.
     * @param {ExternalVendorUpdateManyAndReturnArgs} args - Arguments to update many ExternalVendors.
     * @example
     * // Update many ExternalVendors
     * const externalVendor = await prisma.externalVendor.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ExternalVendors and only return the `id`
     * const externalVendorWithIdOnly = await prisma.externalVendor.updateManyAndReturn({
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
    updateManyAndReturn<T extends ExternalVendorUpdateManyAndReturnArgs>(args: SelectSubset<T, ExternalVendorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExternalVendorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ExternalVendor.
     * @param {ExternalVendorUpsertArgs} args - Arguments to update or create a ExternalVendor.
     * @example
     * // Update or create a ExternalVendor
     * const externalVendor = await prisma.externalVendor.upsert({
     *   create: {
     *     // ... data to create a ExternalVendor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExternalVendor we want to update
     *   }
     * })
     */
    upsert<T extends ExternalVendorUpsertArgs>(args: SelectSubset<T, ExternalVendorUpsertArgs<ExtArgs>>): Prisma__ExternalVendorClient<$Result.GetResult<Prisma.$ExternalVendorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExternalVendors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExternalVendorCountArgs} args - Arguments to filter ExternalVendors to count.
     * @example
     * // Count the number of ExternalVendors
     * const count = await prisma.externalVendor.count({
     *   where: {
     *     // ... the filter for the ExternalVendors we want to count
     *   }
     * })
    **/
    count<T extends ExternalVendorCountArgs>(
      args?: Subset<T, ExternalVendorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExternalVendorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExternalVendor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExternalVendorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ExternalVendorAggregateArgs>(args: Subset<T, ExternalVendorAggregateArgs>): Prisma.PrismaPromise<GetExternalVendorAggregateType<T>>

    /**
     * Group by ExternalVendor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExternalVendorGroupByArgs} args - Group by arguments.
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
      T extends ExternalVendorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExternalVendorGroupByArgs['orderBy'] }
        : { orderBy?: ExternalVendorGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ExternalVendorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExternalVendorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExternalVendor model
   */
  readonly fields: ExternalVendorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExternalVendor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExternalVendorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    budgetItem<T extends ExternalVendor$budgetItemArgs<ExtArgs> = {}>(args?: Subset<T, ExternalVendor$budgetItemArgs<ExtArgs>>): Prisma__BudgetItemClient<$Result.GetResult<Prisma.$BudgetItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ExternalVendor model
   */
  interface ExternalVendorFieldRefs {
    readonly id: FieldRef<"ExternalVendor", 'String'>
    readonly userId: FieldRef<"ExternalVendor", 'String'>
    readonly name: FieldRef<"ExternalVendor", 'String'>
    readonly category: FieldRef<"ExternalVendor", 'String'>
    readonly city: FieldRef<"ExternalVendor", 'String'>
    readonly phone: FieldRef<"ExternalVendor", 'String'>
    readonly website: FieldRef<"ExternalVendor", 'String'>
    readonly quotedPrice: FieldRef<"ExternalVendor", 'Int'>
    readonly notes: FieldRef<"ExternalVendor", 'String'>
    readonly stage: FieldRef<"ExternalVendor", 'VendorPipelineStage'>
    readonly createdAt: FieldRef<"ExternalVendor", 'DateTime'>
    readonly updatedAt: FieldRef<"ExternalVendor", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ExternalVendor findUnique
   */
  export type ExternalVendorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExternalVendor
     */
    select?: ExternalVendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExternalVendor
     */
    omit?: ExternalVendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExternalVendorInclude<ExtArgs> | null
    /**
     * Filter, which ExternalVendor to fetch.
     */
    where: ExternalVendorWhereUniqueInput
  }

  /**
   * ExternalVendor findUniqueOrThrow
   */
  export type ExternalVendorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExternalVendor
     */
    select?: ExternalVendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExternalVendor
     */
    omit?: ExternalVendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExternalVendorInclude<ExtArgs> | null
    /**
     * Filter, which ExternalVendor to fetch.
     */
    where: ExternalVendorWhereUniqueInput
  }

  /**
   * ExternalVendor findFirst
   */
  export type ExternalVendorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExternalVendor
     */
    select?: ExternalVendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExternalVendor
     */
    omit?: ExternalVendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExternalVendorInclude<ExtArgs> | null
    /**
     * Filter, which ExternalVendor to fetch.
     */
    where?: ExternalVendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExternalVendors to fetch.
     */
    orderBy?: ExternalVendorOrderByWithRelationInput | ExternalVendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExternalVendors.
     */
    cursor?: ExternalVendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExternalVendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExternalVendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExternalVendors.
     */
    distinct?: ExternalVendorScalarFieldEnum | ExternalVendorScalarFieldEnum[]
  }

  /**
   * ExternalVendor findFirstOrThrow
   */
  export type ExternalVendorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExternalVendor
     */
    select?: ExternalVendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExternalVendor
     */
    omit?: ExternalVendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExternalVendorInclude<ExtArgs> | null
    /**
     * Filter, which ExternalVendor to fetch.
     */
    where?: ExternalVendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExternalVendors to fetch.
     */
    orderBy?: ExternalVendorOrderByWithRelationInput | ExternalVendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExternalVendors.
     */
    cursor?: ExternalVendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExternalVendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExternalVendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExternalVendors.
     */
    distinct?: ExternalVendorScalarFieldEnum | ExternalVendorScalarFieldEnum[]
  }

  /**
   * ExternalVendor findMany
   */
  export type ExternalVendorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExternalVendor
     */
    select?: ExternalVendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExternalVendor
     */
    omit?: ExternalVendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExternalVendorInclude<ExtArgs> | null
    /**
     * Filter, which ExternalVendors to fetch.
     */
    where?: ExternalVendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExternalVendors to fetch.
     */
    orderBy?: ExternalVendorOrderByWithRelationInput | ExternalVendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExternalVendors.
     */
    cursor?: ExternalVendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExternalVendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExternalVendors.
     */
    skip?: number
    distinct?: ExternalVendorScalarFieldEnum | ExternalVendorScalarFieldEnum[]
  }

  /**
   * ExternalVendor create
   */
  export type ExternalVendorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExternalVendor
     */
    select?: ExternalVendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExternalVendor
     */
    omit?: ExternalVendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExternalVendorInclude<ExtArgs> | null
    /**
     * The data needed to create a ExternalVendor.
     */
    data: XOR<ExternalVendorCreateInput, ExternalVendorUncheckedCreateInput>
  }

  /**
   * ExternalVendor createMany
   */
  export type ExternalVendorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExternalVendors.
     */
    data: ExternalVendorCreateManyInput | ExternalVendorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExternalVendor createManyAndReturn
   */
  export type ExternalVendorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExternalVendor
     */
    select?: ExternalVendorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExternalVendor
     */
    omit?: ExternalVendorOmit<ExtArgs> | null
    /**
     * The data used to create many ExternalVendors.
     */
    data: ExternalVendorCreateManyInput | ExternalVendorCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExternalVendorIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExternalVendor update
   */
  export type ExternalVendorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExternalVendor
     */
    select?: ExternalVendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExternalVendor
     */
    omit?: ExternalVendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExternalVendorInclude<ExtArgs> | null
    /**
     * The data needed to update a ExternalVendor.
     */
    data: XOR<ExternalVendorUpdateInput, ExternalVendorUncheckedUpdateInput>
    /**
     * Choose, which ExternalVendor to update.
     */
    where: ExternalVendorWhereUniqueInput
  }

  /**
   * ExternalVendor updateMany
   */
  export type ExternalVendorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExternalVendors.
     */
    data: XOR<ExternalVendorUpdateManyMutationInput, ExternalVendorUncheckedUpdateManyInput>
    /**
     * Filter which ExternalVendors to update
     */
    where?: ExternalVendorWhereInput
    /**
     * Limit how many ExternalVendors to update.
     */
    limit?: number
  }

  /**
   * ExternalVendor updateManyAndReturn
   */
  export type ExternalVendorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExternalVendor
     */
    select?: ExternalVendorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExternalVendor
     */
    omit?: ExternalVendorOmit<ExtArgs> | null
    /**
     * The data used to update ExternalVendors.
     */
    data: XOR<ExternalVendorUpdateManyMutationInput, ExternalVendorUncheckedUpdateManyInput>
    /**
     * Filter which ExternalVendors to update
     */
    where?: ExternalVendorWhereInput
    /**
     * Limit how many ExternalVendors to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExternalVendorIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExternalVendor upsert
   */
  export type ExternalVendorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExternalVendor
     */
    select?: ExternalVendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExternalVendor
     */
    omit?: ExternalVendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExternalVendorInclude<ExtArgs> | null
    /**
     * The filter to search for the ExternalVendor to update in case it exists.
     */
    where: ExternalVendorWhereUniqueInput
    /**
     * In case the ExternalVendor found by the `where` argument doesn't exist, create a new ExternalVendor with this data.
     */
    create: XOR<ExternalVendorCreateInput, ExternalVendorUncheckedCreateInput>
    /**
     * In case the ExternalVendor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExternalVendorUpdateInput, ExternalVendorUncheckedUpdateInput>
  }

  /**
   * ExternalVendor delete
   */
  export type ExternalVendorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExternalVendor
     */
    select?: ExternalVendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExternalVendor
     */
    omit?: ExternalVendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExternalVendorInclude<ExtArgs> | null
    /**
     * Filter which ExternalVendor to delete.
     */
    where: ExternalVendorWhereUniqueInput
  }

  /**
   * ExternalVendor deleteMany
   */
  export type ExternalVendorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExternalVendors to delete
     */
    where?: ExternalVendorWhereInput
    /**
     * Limit how many ExternalVendors to delete.
     */
    limit?: number
  }

  /**
   * ExternalVendor.budgetItem
   */
  export type ExternalVendor$budgetItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BudgetItem
     */
    select?: BudgetItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BudgetItem
     */
    omit?: BudgetItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetItemInclude<ExtArgs> | null
    where?: BudgetItemWhereInput
  }

  /**
   * ExternalVendor without action
   */
  export type ExternalVendorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExternalVendor
     */
    select?: ExternalVendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExternalVendor
     */
    omit?: ExternalVendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExternalVendorInclude<ExtArgs> | null
  }


  /**
   * Model Wedding
   */

  export type AggregateWedding = {
    _count: WeddingCountAggregateOutputType | null
    _avg: WeddingAvgAggregateOutputType | null
    _sum: WeddingSumAggregateOutputType | null
    _min: WeddingMinAggregateOutputType | null
    _max: WeddingMaxAggregateOutputType | null
  }

  export type WeddingAvgAggregateOutputType = {
    guests: number | null
    budget: number | null
  }

  export type WeddingSumAggregateOutputType = {
    guests: number | null
    budget: number | null
  }

  export type WeddingMinAggregateOutputType = {
    id: string | null
    userId: string | null
    date: Date | null
    city: string | null
    guests: number | null
    budget: number | null
    partnerOneName: string | null
    partnerTwoName: string | null
    couplePhotoUrl: string | null
    planningStage: string | null
    cityUndecided: boolean | null
    guestsUndecided: boolean | null
  }

  export type WeddingMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    date: Date | null
    city: string | null
    guests: number | null
    budget: number | null
    partnerOneName: string | null
    partnerTwoName: string | null
    couplePhotoUrl: string | null
    planningStage: string | null
    cityUndecided: boolean | null
    guestsUndecided: boolean | null
  }

  export type WeddingCountAggregateOutputType = {
    id: number
    userId: number
    date: number
    city: number
    guests: number
    budget: number
    partnerOneName: number
    partnerTwoName: number
    couplePhotoUrl: number
    planningStage: number
    cityUndecided: number
    guestsUndecided: number
    dayPlan: number
    _all: number
  }


  export type WeddingAvgAggregateInputType = {
    guests?: true
    budget?: true
  }

  export type WeddingSumAggregateInputType = {
    guests?: true
    budget?: true
  }

  export type WeddingMinAggregateInputType = {
    id?: true
    userId?: true
    date?: true
    city?: true
    guests?: true
    budget?: true
    partnerOneName?: true
    partnerTwoName?: true
    couplePhotoUrl?: true
    planningStage?: true
    cityUndecided?: true
    guestsUndecided?: true
  }

  export type WeddingMaxAggregateInputType = {
    id?: true
    userId?: true
    date?: true
    city?: true
    guests?: true
    budget?: true
    partnerOneName?: true
    partnerTwoName?: true
    couplePhotoUrl?: true
    planningStage?: true
    cityUndecided?: true
    guestsUndecided?: true
  }

  export type WeddingCountAggregateInputType = {
    id?: true
    userId?: true
    date?: true
    city?: true
    guests?: true
    budget?: true
    partnerOneName?: true
    partnerTwoName?: true
    couplePhotoUrl?: true
    planningStage?: true
    cityUndecided?: true
    guestsUndecided?: true
    dayPlan?: true
    _all?: true
  }

  export type WeddingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Wedding to aggregate.
     */
    where?: WeddingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Weddings to fetch.
     */
    orderBy?: WeddingOrderByWithRelationInput | WeddingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WeddingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Weddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Weddings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Weddings
    **/
    _count?: true | WeddingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WeddingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WeddingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WeddingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WeddingMaxAggregateInputType
  }

  export type GetWeddingAggregateType<T extends WeddingAggregateArgs> = {
        [P in keyof T & keyof AggregateWedding]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWedding[P]>
      : GetScalarType<T[P], AggregateWedding[P]>
  }




  export type WeddingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeddingWhereInput
    orderBy?: WeddingOrderByWithAggregationInput | WeddingOrderByWithAggregationInput[]
    by: WeddingScalarFieldEnum[] | WeddingScalarFieldEnum
    having?: WeddingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WeddingCountAggregateInputType | true
    _avg?: WeddingAvgAggregateInputType
    _sum?: WeddingSumAggregateInputType
    _min?: WeddingMinAggregateInputType
    _max?: WeddingMaxAggregateInputType
  }

  export type WeddingGroupByOutputType = {
    id: string
    userId: string
    date: Date
    city: string
    guests: number
    budget: number
    partnerOneName: string
    partnerTwoName: string
    couplePhotoUrl: string | null
    planningStage: string
    cityUndecided: boolean
    guestsUndecided: boolean
    dayPlan: JsonValue | null
    _count: WeddingCountAggregateOutputType | null
    _avg: WeddingAvgAggregateOutputType | null
    _sum: WeddingSumAggregateOutputType | null
    _min: WeddingMinAggregateOutputType | null
    _max: WeddingMaxAggregateOutputType | null
  }

  type GetWeddingGroupByPayload<T extends WeddingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WeddingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WeddingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WeddingGroupByOutputType[P]>
            : GetScalarType<T[P], WeddingGroupByOutputType[P]>
        }
      >
    >


  export type WeddingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    date?: boolean
    city?: boolean
    guests?: boolean
    budget?: boolean
    partnerOneName?: boolean
    partnerTwoName?: boolean
    couplePhotoUrl?: boolean
    planningStage?: boolean
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    members?: boolean | Wedding$membersArgs<ExtArgs>
    invites?: boolean | Wedding$invitesArgs<ExtArgs>
    tasks?: boolean | Wedding$tasksArgs<ExtArgs>
    guestList?: boolean | Wedding$guestListArgs<ExtArgs>
    budgetItems?: boolean | Wedding$budgetItemsArgs<ExtArgs>
    website?: boolean | Wedding$websiteArgs<ExtArgs>
    invitation?: boolean | Wedding$invitationArgs<ExtArgs>
    _count?: boolean | WeddingCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wedding"]>

  export type WeddingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    date?: boolean
    city?: boolean
    guests?: boolean
    budget?: boolean
    partnerOneName?: boolean
    partnerTwoName?: boolean
    couplePhotoUrl?: boolean
    planningStage?: boolean
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wedding"]>

  export type WeddingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    date?: boolean
    city?: boolean
    guests?: boolean
    budget?: boolean
    partnerOneName?: boolean
    partnerTwoName?: boolean
    couplePhotoUrl?: boolean
    planningStage?: boolean
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wedding"]>

  export type WeddingSelectScalar = {
    id?: boolean
    userId?: boolean
    date?: boolean
    city?: boolean
    guests?: boolean
    budget?: boolean
    partnerOneName?: boolean
    partnerTwoName?: boolean
    couplePhotoUrl?: boolean
    planningStage?: boolean
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: boolean
  }

  export type WeddingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "date" | "city" | "guests" | "budget" | "partnerOneName" | "partnerTwoName" | "couplePhotoUrl" | "planningStage" | "cityUndecided" | "guestsUndecided" | "dayPlan", ExtArgs["result"]["wedding"]>
  export type WeddingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    members?: boolean | Wedding$membersArgs<ExtArgs>
    invites?: boolean | Wedding$invitesArgs<ExtArgs>
    tasks?: boolean | Wedding$tasksArgs<ExtArgs>
    guestList?: boolean | Wedding$guestListArgs<ExtArgs>
    budgetItems?: boolean | Wedding$budgetItemsArgs<ExtArgs>
    website?: boolean | Wedding$websiteArgs<ExtArgs>
    invitation?: boolean | Wedding$invitationArgs<ExtArgs>
    _count?: boolean | WeddingCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WeddingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type WeddingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $WeddingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Wedding"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      members: Prisma.$WeddingMemberPayload<ExtArgs>[]
      invites: Prisma.$WeddingInvitePayload<ExtArgs>[]
      tasks: Prisma.$TaskPayload<ExtArgs>[]
      guestList: Prisma.$GuestPayload<ExtArgs>[]
      budgetItems: Prisma.$BudgetItemPayload<ExtArgs>[]
      website: Prisma.$WeddingWebsitePayload<ExtArgs> | null
      invitation: Prisma.$WeddingInvitationPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      date: Date
      city: string
      guests: number
      budget: number
      partnerOneName: string
      partnerTwoName: string
      couplePhotoUrl: string | null
      planningStage: string
      cityUndecided: boolean
      guestsUndecided: boolean
      dayPlan: Prisma.JsonValue | null
    }, ExtArgs["result"]["wedding"]>
    composites: {}
  }

  type WeddingGetPayload<S extends boolean | null | undefined | WeddingDefaultArgs> = $Result.GetResult<Prisma.$WeddingPayload, S>

  type WeddingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WeddingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WeddingCountAggregateInputType | true
    }

  export interface WeddingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Wedding'], meta: { name: 'Wedding' } }
    /**
     * Find zero or one Wedding that matches the filter.
     * @param {WeddingFindUniqueArgs} args - Arguments to find a Wedding
     * @example
     * // Get one Wedding
     * const wedding = await prisma.wedding.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WeddingFindUniqueArgs>(args: SelectSubset<T, WeddingFindUniqueArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Wedding that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WeddingFindUniqueOrThrowArgs} args - Arguments to find a Wedding
     * @example
     * // Get one Wedding
     * const wedding = await prisma.wedding.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WeddingFindUniqueOrThrowArgs>(args: SelectSubset<T, WeddingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Wedding that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingFindFirstArgs} args - Arguments to find a Wedding
     * @example
     * // Get one Wedding
     * const wedding = await prisma.wedding.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WeddingFindFirstArgs>(args?: SelectSubset<T, WeddingFindFirstArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Wedding that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingFindFirstOrThrowArgs} args - Arguments to find a Wedding
     * @example
     * // Get one Wedding
     * const wedding = await prisma.wedding.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WeddingFindFirstOrThrowArgs>(args?: SelectSubset<T, WeddingFindFirstOrThrowArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Weddings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Weddings
     * const weddings = await prisma.wedding.findMany()
     * 
     * // Get first 10 Weddings
     * const weddings = await prisma.wedding.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const weddingWithIdOnly = await prisma.wedding.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WeddingFindManyArgs>(args?: SelectSubset<T, WeddingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Wedding.
     * @param {WeddingCreateArgs} args - Arguments to create a Wedding.
     * @example
     * // Create one Wedding
     * const Wedding = await prisma.wedding.create({
     *   data: {
     *     // ... data to create a Wedding
     *   }
     * })
     * 
     */
    create<T extends WeddingCreateArgs>(args: SelectSubset<T, WeddingCreateArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Weddings.
     * @param {WeddingCreateManyArgs} args - Arguments to create many Weddings.
     * @example
     * // Create many Weddings
     * const wedding = await prisma.wedding.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WeddingCreateManyArgs>(args?: SelectSubset<T, WeddingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Weddings and returns the data saved in the database.
     * @param {WeddingCreateManyAndReturnArgs} args - Arguments to create many Weddings.
     * @example
     * // Create many Weddings
     * const wedding = await prisma.wedding.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Weddings and only return the `id`
     * const weddingWithIdOnly = await prisma.wedding.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WeddingCreateManyAndReturnArgs>(args?: SelectSubset<T, WeddingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Wedding.
     * @param {WeddingDeleteArgs} args - Arguments to delete one Wedding.
     * @example
     * // Delete one Wedding
     * const Wedding = await prisma.wedding.delete({
     *   where: {
     *     // ... filter to delete one Wedding
     *   }
     * })
     * 
     */
    delete<T extends WeddingDeleteArgs>(args: SelectSubset<T, WeddingDeleteArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Wedding.
     * @param {WeddingUpdateArgs} args - Arguments to update one Wedding.
     * @example
     * // Update one Wedding
     * const wedding = await prisma.wedding.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WeddingUpdateArgs>(args: SelectSubset<T, WeddingUpdateArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Weddings.
     * @param {WeddingDeleteManyArgs} args - Arguments to filter Weddings to delete.
     * @example
     * // Delete a few Weddings
     * const { count } = await prisma.wedding.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WeddingDeleteManyArgs>(args?: SelectSubset<T, WeddingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Weddings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Weddings
     * const wedding = await prisma.wedding.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WeddingUpdateManyArgs>(args: SelectSubset<T, WeddingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Weddings and returns the data updated in the database.
     * @param {WeddingUpdateManyAndReturnArgs} args - Arguments to update many Weddings.
     * @example
     * // Update many Weddings
     * const wedding = await prisma.wedding.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Weddings and only return the `id`
     * const weddingWithIdOnly = await prisma.wedding.updateManyAndReturn({
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
    updateManyAndReturn<T extends WeddingUpdateManyAndReturnArgs>(args: SelectSubset<T, WeddingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Wedding.
     * @param {WeddingUpsertArgs} args - Arguments to update or create a Wedding.
     * @example
     * // Update or create a Wedding
     * const wedding = await prisma.wedding.upsert({
     *   create: {
     *     // ... data to create a Wedding
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Wedding we want to update
     *   }
     * })
     */
    upsert<T extends WeddingUpsertArgs>(args: SelectSubset<T, WeddingUpsertArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Weddings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingCountArgs} args - Arguments to filter Weddings to count.
     * @example
     * // Count the number of Weddings
     * const count = await prisma.wedding.count({
     *   where: {
     *     // ... the filter for the Weddings we want to count
     *   }
     * })
    **/
    count<T extends WeddingCountArgs>(
      args?: Subset<T, WeddingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WeddingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Wedding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends WeddingAggregateArgs>(args: Subset<T, WeddingAggregateArgs>): Prisma.PrismaPromise<GetWeddingAggregateType<T>>

    /**
     * Group by Wedding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingGroupByArgs} args - Group by arguments.
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
      T extends WeddingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WeddingGroupByArgs['orderBy'] }
        : { orderBy?: WeddingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, WeddingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWeddingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Wedding model
   */
  readonly fields: WeddingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Wedding.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WeddingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    members<T extends Wedding$membersArgs<ExtArgs> = {}>(args?: Subset<T, Wedding$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    invites<T extends Wedding$invitesArgs<ExtArgs> = {}>(args?: Subset<T, Wedding$invitesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingInvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tasks<T extends Wedding$tasksArgs<ExtArgs> = {}>(args?: Subset<T, Wedding$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    guestList<T extends Wedding$guestListArgs<ExtArgs> = {}>(args?: Subset<T, Wedding$guestListArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    budgetItems<T extends Wedding$budgetItemsArgs<ExtArgs> = {}>(args?: Subset<T, Wedding$budgetItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BudgetItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    website<T extends Wedding$websiteArgs<ExtArgs> = {}>(args?: Subset<T, Wedding$websiteArgs<ExtArgs>>): Prisma__WeddingWebsiteClient<$Result.GetResult<Prisma.$WeddingWebsitePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    invitation<T extends Wedding$invitationArgs<ExtArgs> = {}>(args?: Subset<T, Wedding$invitationArgs<ExtArgs>>): Prisma__WeddingInvitationClient<$Result.GetResult<Prisma.$WeddingInvitationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Wedding model
   */
  interface WeddingFieldRefs {
    readonly id: FieldRef<"Wedding", 'String'>
    readonly userId: FieldRef<"Wedding", 'String'>
    readonly date: FieldRef<"Wedding", 'DateTime'>
    readonly city: FieldRef<"Wedding", 'String'>
    readonly guests: FieldRef<"Wedding", 'Int'>
    readonly budget: FieldRef<"Wedding", 'Int'>
    readonly partnerOneName: FieldRef<"Wedding", 'String'>
    readonly partnerTwoName: FieldRef<"Wedding", 'String'>
    readonly couplePhotoUrl: FieldRef<"Wedding", 'String'>
    readonly planningStage: FieldRef<"Wedding", 'String'>
    readonly cityUndecided: FieldRef<"Wedding", 'Boolean'>
    readonly guestsUndecided: FieldRef<"Wedding", 'Boolean'>
    readonly dayPlan: FieldRef<"Wedding", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * Wedding findUnique
   */
  export type WeddingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wedding
     */
    omit?: WeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    /**
     * Filter, which Wedding to fetch.
     */
    where: WeddingWhereUniqueInput
  }

  /**
   * Wedding findUniqueOrThrow
   */
  export type WeddingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wedding
     */
    omit?: WeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    /**
     * Filter, which Wedding to fetch.
     */
    where: WeddingWhereUniqueInput
  }

  /**
   * Wedding findFirst
   */
  export type WeddingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wedding
     */
    omit?: WeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    /**
     * Filter, which Wedding to fetch.
     */
    where?: WeddingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Weddings to fetch.
     */
    orderBy?: WeddingOrderByWithRelationInput | WeddingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Weddings.
     */
    cursor?: WeddingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Weddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Weddings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Weddings.
     */
    distinct?: WeddingScalarFieldEnum | WeddingScalarFieldEnum[]
  }

  /**
   * Wedding findFirstOrThrow
   */
  export type WeddingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wedding
     */
    omit?: WeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    /**
     * Filter, which Wedding to fetch.
     */
    where?: WeddingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Weddings to fetch.
     */
    orderBy?: WeddingOrderByWithRelationInput | WeddingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Weddings.
     */
    cursor?: WeddingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Weddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Weddings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Weddings.
     */
    distinct?: WeddingScalarFieldEnum | WeddingScalarFieldEnum[]
  }

  /**
   * Wedding findMany
   */
  export type WeddingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wedding
     */
    omit?: WeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    /**
     * Filter, which Weddings to fetch.
     */
    where?: WeddingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Weddings to fetch.
     */
    orderBy?: WeddingOrderByWithRelationInput | WeddingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Weddings.
     */
    cursor?: WeddingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Weddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Weddings.
     */
    skip?: number
    distinct?: WeddingScalarFieldEnum | WeddingScalarFieldEnum[]
  }

  /**
   * Wedding create
   */
  export type WeddingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wedding
     */
    omit?: WeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    /**
     * The data needed to create a Wedding.
     */
    data: XOR<WeddingCreateInput, WeddingUncheckedCreateInput>
  }

  /**
   * Wedding createMany
   */
  export type WeddingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Weddings.
     */
    data: WeddingCreateManyInput | WeddingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Wedding createManyAndReturn
   */
  export type WeddingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Wedding
     */
    omit?: WeddingOmit<ExtArgs> | null
    /**
     * The data used to create many Weddings.
     */
    data: WeddingCreateManyInput | WeddingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Wedding update
   */
  export type WeddingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wedding
     */
    omit?: WeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    /**
     * The data needed to update a Wedding.
     */
    data: XOR<WeddingUpdateInput, WeddingUncheckedUpdateInput>
    /**
     * Choose, which Wedding to update.
     */
    where: WeddingWhereUniqueInput
  }

  /**
   * Wedding updateMany
   */
  export type WeddingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Weddings.
     */
    data: XOR<WeddingUpdateManyMutationInput, WeddingUncheckedUpdateManyInput>
    /**
     * Filter which Weddings to update
     */
    where?: WeddingWhereInput
    /**
     * Limit how many Weddings to update.
     */
    limit?: number
  }

  /**
   * Wedding updateManyAndReturn
   */
  export type WeddingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Wedding
     */
    omit?: WeddingOmit<ExtArgs> | null
    /**
     * The data used to update Weddings.
     */
    data: XOR<WeddingUpdateManyMutationInput, WeddingUncheckedUpdateManyInput>
    /**
     * Filter which Weddings to update
     */
    where?: WeddingWhereInput
    /**
     * Limit how many Weddings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Wedding upsert
   */
  export type WeddingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wedding
     */
    omit?: WeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    /**
     * The filter to search for the Wedding to update in case it exists.
     */
    where: WeddingWhereUniqueInput
    /**
     * In case the Wedding found by the `where` argument doesn't exist, create a new Wedding with this data.
     */
    create: XOR<WeddingCreateInput, WeddingUncheckedCreateInput>
    /**
     * In case the Wedding was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WeddingUpdateInput, WeddingUncheckedUpdateInput>
  }

  /**
   * Wedding delete
   */
  export type WeddingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wedding
     */
    omit?: WeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
    /**
     * Filter which Wedding to delete.
     */
    where: WeddingWhereUniqueInput
  }

  /**
   * Wedding deleteMany
   */
  export type WeddingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Weddings to delete
     */
    where?: WeddingWhereInput
    /**
     * Limit how many Weddings to delete.
     */
    limit?: number
  }

  /**
   * Wedding.members
   */
  export type Wedding$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingMember
     */
    select?: WeddingMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingMember
     */
    omit?: WeddingMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingMemberInclude<ExtArgs> | null
    where?: WeddingMemberWhereInput
    orderBy?: WeddingMemberOrderByWithRelationInput | WeddingMemberOrderByWithRelationInput[]
    cursor?: WeddingMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WeddingMemberScalarFieldEnum | WeddingMemberScalarFieldEnum[]
  }

  /**
   * Wedding.invites
   */
  export type Wedding$invitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvite
     */
    select?: WeddingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvite
     */
    omit?: WeddingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInviteInclude<ExtArgs> | null
    where?: WeddingInviteWhereInput
    orderBy?: WeddingInviteOrderByWithRelationInput | WeddingInviteOrderByWithRelationInput[]
    cursor?: WeddingInviteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WeddingInviteScalarFieldEnum | WeddingInviteScalarFieldEnum[]
  }

  /**
   * Wedding.tasks
   */
  export type Wedding$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Wedding.guestList
   */
  export type Wedding$guestListArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guest
     */
    omit?: GuestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
    where?: GuestWhereInput
    orderBy?: GuestOrderByWithRelationInput | GuestOrderByWithRelationInput[]
    cursor?: GuestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GuestScalarFieldEnum | GuestScalarFieldEnum[]
  }

  /**
   * Wedding.budgetItems
   */
  export type Wedding$budgetItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BudgetItem
     */
    select?: BudgetItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BudgetItem
     */
    omit?: BudgetItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetItemInclude<ExtArgs> | null
    where?: BudgetItemWhereInput
    orderBy?: BudgetItemOrderByWithRelationInput | BudgetItemOrderByWithRelationInput[]
    cursor?: BudgetItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BudgetItemScalarFieldEnum | BudgetItemScalarFieldEnum[]
  }

  /**
   * Wedding.website
   */
  export type Wedding$websiteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingWebsite
     */
    select?: WeddingWebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingWebsite
     */
    omit?: WeddingWebsiteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingWebsiteInclude<ExtArgs> | null
    where?: WeddingWebsiteWhereInput
  }

  /**
   * Wedding.invitation
   */
  export type Wedding$invitationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvitation
     */
    select?: WeddingInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvitation
     */
    omit?: WeddingInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInvitationInclude<ExtArgs> | null
    where?: WeddingInvitationWhereInput
  }

  /**
   * Wedding without action
   */
  export type WeddingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wedding
     */
    select?: WeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wedding
     */
    omit?: WeddingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInclude<ExtArgs> | null
  }


  /**
   * Model WeddingWebsite
   */

  export type AggregateWeddingWebsite = {
    _count: WeddingWebsiteCountAggregateOutputType | null
    _min: WeddingWebsiteMinAggregateOutputType | null
    _max: WeddingWebsiteMaxAggregateOutputType | null
  }

  export type WeddingWebsiteMinAggregateOutputType = {
    id: string | null
    weddingId: string | null
    slug: string | null
    templateId: string | null
    published: boolean | null
    publishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WeddingWebsiteMaxAggregateOutputType = {
    id: string | null
    weddingId: string | null
    slug: string | null
    templateId: string | null
    published: boolean | null
    publishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WeddingWebsiteCountAggregateOutputType = {
    id: number
    weddingId: number
    slug: number
    templateId: number
    published: number
    publishedAt: number
    content: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WeddingWebsiteMinAggregateInputType = {
    id?: true
    weddingId?: true
    slug?: true
    templateId?: true
    published?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WeddingWebsiteMaxAggregateInputType = {
    id?: true
    weddingId?: true
    slug?: true
    templateId?: true
    published?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WeddingWebsiteCountAggregateInputType = {
    id?: true
    weddingId?: true
    slug?: true
    templateId?: true
    published?: true
    publishedAt?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WeddingWebsiteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WeddingWebsite to aggregate.
     */
    where?: WeddingWebsiteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeddingWebsites to fetch.
     */
    orderBy?: WeddingWebsiteOrderByWithRelationInput | WeddingWebsiteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WeddingWebsiteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeddingWebsites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeddingWebsites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WeddingWebsites
    **/
    _count?: true | WeddingWebsiteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WeddingWebsiteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WeddingWebsiteMaxAggregateInputType
  }

  export type GetWeddingWebsiteAggregateType<T extends WeddingWebsiteAggregateArgs> = {
        [P in keyof T & keyof AggregateWeddingWebsite]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWeddingWebsite[P]>
      : GetScalarType<T[P], AggregateWeddingWebsite[P]>
  }




  export type WeddingWebsiteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeddingWebsiteWhereInput
    orderBy?: WeddingWebsiteOrderByWithAggregationInput | WeddingWebsiteOrderByWithAggregationInput[]
    by: WeddingWebsiteScalarFieldEnum[] | WeddingWebsiteScalarFieldEnum
    having?: WeddingWebsiteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WeddingWebsiteCountAggregateInputType | true
    _min?: WeddingWebsiteMinAggregateInputType
    _max?: WeddingWebsiteMaxAggregateInputType
  }

  export type WeddingWebsiteGroupByOutputType = {
    id: string
    weddingId: string
    slug: string
    templateId: string
    published: boolean
    publishedAt: Date | null
    content: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: WeddingWebsiteCountAggregateOutputType | null
    _min: WeddingWebsiteMinAggregateOutputType | null
    _max: WeddingWebsiteMaxAggregateOutputType | null
  }

  type GetWeddingWebsiteGroupByPayload<T extends WeddingWebsiteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WeddingWebsiteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WeddingWebsiteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WeddingWebsiteGroupByOutputType[P]>
            : GetScalarType<T[P], WeddingWebsiteGroupByOutputType[P]>
        }
      >
    >


  export type WeddingWebsiteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    slug?: boolean
    templateId?: boolean
    published?: boolean
    publishedAt?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["weddingWebsite"]>

  export type WeddingWebsiteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    slug?: boolean
    templateId?: boolean
    published?: boolean
    publishedAt?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["weddingWebsite"]>

  export type WeddingWebsiteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    slug?: boolean
    templateId?: boolean
    published?: boolean
    publishedAt?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["weddingWebsite"]>

  export type WeddingWebsiteSelectScalar = {
    id?: boolean
    weddingId?: boolean
    slug?: boolean
    templateId?: boolean
    published?: boolean
    publishedAt?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WeddingWebsiteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "weddingId" | "slug" | "templateId" | "published" | "publishedAt" | "content" | "createdAt" | "updatedAt", ExtArgs["result"]["weddingWebsite"]>
  export type WeddingWebsiteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }
  export type WeddingWebsiteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }
  export type WeddingWebsiteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }

  export type $WeddingWebsitePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WeddingWebsite"
    objects: {
      wedding: Prisma.$WeddingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      weddingId: string
      slug: string
      templateId: string
      published: boolean
      publishedAt: Date | null
      content: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["weddingWebsite"]>
    composites: {}
  }

  type WeddingWebsiteGetPayload<S extends boolean | null | undefined | WeddingWebsiteDefaultArgs> = $Result.GetResult<Prisma.$WeddingWebsitePayload, S>

  type WeddingWebsiteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WeddingWebsiteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WeddingWebsiteCountAggregateInputType | true
    }

  export interface WeddingWebsiteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WeddingWebsite'], meta: { name: 'WeddingWebsite' } }
    /**
     * Find zero or one WeddingWebsite that matches the filter.
     * @param {WeddingWebsiteFindUniqueArgs} args - Arguments to find a WeddingWebsite
     * @example
     * // Get one WeddingWebsite
     * const weddingWebsite = await prisma.weddingWebsite.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WeddingWebsiteFindUniqueArgs>(args: SelectSubset<T, WeddingWebsiteFindUniqueArgs<ExtArgs>>): Prisma__WeddingWebsiteClient<$Result.GetResult<Prisma.$WeddingWebsitePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WeddingWebsite that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WeddingWebsiteFindUniqueOrThrowArgs} args - Arguments to find a WeddingWebsite
     * @example
     * // Get one WeddingWebsite
     * const weddingWebsite = await prisma.weddingWebsite.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WeddingWebsiteFindUniqueOrThrowArgs>(args: SelectSubset<T, WeddingWebsiteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WeddingWebsiteClient<$Result.GetResult<Prisma.$WeddingWebsitePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WeddingWebsite that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingWebsiteFindFirstArgs} args - Arguments to find a WeddingWebsite
     * @example
     * // Get one WeddingWebsite
     * const weddingWebsite = await prisma.weddingWebsite.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WeddingWebsiteFindFirstArgs>(args?: SelectSubset<T, WeddingWebsiteFindFirstArgs<ExtArgs>>): Prisma__WeddingWebsiteClient<$Result.GetResult<Prisma.$WeddingWebsitePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WeddingWebsite that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingWebsiteFindFirstOrThrowArgs} args - Arguments to find a WeddingWebsite
     * @example
     * // Get one WeddingWebsite
     * const weddingWebsite = await prisma.weddingWebsite.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WeddingWebsiteFindFirstOrThrowArgs>(args?: SelectSubset<T, WeddingWebsiteFindFirstOrThrowArgs<ExtArgs>>): Prisma__WeddingWebsiteClient<$Result.GetResult<Prisma.$WeddingWebsitePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WeddingWebsites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingWebsiteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WeddingWebsites
     * const weddingWebsites = await prisma.weddingWebsite.findMany()
     * 
     * // Get first 10 WeddingWebsites
     * const weddingWebsites = await prisma.weddingWebsite.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const weddingWebsiteWithIdOnly = await prisma.weddingWebsite.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WeddingWebsiteFindManyArgs>(args?: SelectSubset<T, WeddingWebsiteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingWebsitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WeddingWebsite.
     * @param {WeddingWebsiteCreateArgs} args - Arguments to create a WeddingWebsite.
     * @example
     * // Create one WeddingWebsite
     * const WeddingWebsite = await prisma.weddingWebsite.create({
     *   data: {
     *     // ... data to create a WeddingWebsite
     *   }
     * })
     * 
     */
    create<T extends WeddingWebsiteCreateArgs>(args: SelectSubset<T, WeddingWebsiteCreateArgs<ExtArgs>>): Prisma__WeddingWebsiteClient<$Result.GetResult<Prisma.$WeddingWebsitePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WeddingWebsites.
     * @param {WeddingWebsiteCreateManyArgs} args - Arguments to create many WeddingWebsites.
     * @example
     * // Create many WeddingWebsites
     * const weddingWebsite = await prisma.weddingWebsite.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WeddingWebsiteCreateManyArgs>(args?: SelectSubset<T, WeddingWebsiteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WeddingWebsites and returns the data saved in the database.
     * @param {WeddingWebsiteCreateManyAndReturnArgs} args - Arguments to create many WeddingWebsites.
     * @example
     * // Create many WeddingWebsites
     * const weddingWebsite = await prisma.weddingWebsite.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WeddingWebsites and only return the `id`
     * const weddingWebsiteWithIdOnly = await prisma.weddingWebsite.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WeddingWebsiteCreateManyAndReturnArgs>(args?: SelectSubset<T, WeddingWebsiteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingWebsitePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WeddingWebsite.
     * @param {WeddingWebsiteDeleteArgs} args - Arguments to delete one WeddingWebsite.
     * @example
     * // Delete one WeddingWebsite
     * const WeddingWebsite = await prisma.weddingWebsite.delete({
     *   where: {
     *     // ... filter to delete one WeddingWebsite
     *   }
     * })
     * 
     */
    delete<T extends WeddingWebsiteDeleteArgs>(args: SelectSubset<T, WeddingWebsiteDeleteArgs<ExtArgs>>): Prisma__WeddingWebsiteClient<$Result.GetResult<Prisma.$WeddingWebsitePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WeddingWebsite.
     * @param {WeddingWebsiteUpdateArgs} args - Arguments to update one WeddingWebsite.
     * @example
     * // Update one WeddingWebsite
     * const weddingWebsite = await prisma.weddingWebsite.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WeddingWebsiteUpdateArgs>(args: SelectSubset<T, WeddingWebsiteUpdateArgs<ExtArgs>>): Prisma__WeddingWebsiteClient<$Result.GetResult<Prisma.$WeddingWebsitePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WeddingWebsites.
     * @param {WeddingWebsiteDeleteManyArgs} args - Arguments to filter WeddingWebsites to delete.
     * @example
     * // Delete a few WeddingWebsites
     * const { count } = await prisma.weddingWebsite.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WeddingWebsiteDeleteManyArgs>(args?: SelectSubset<T, WeddingWebsiteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WeddingWebsites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingWebsiteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WeddingWebsites
     * const weddingWebsite = await prisma.weddingWebsite.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WeddingWebsiteUpdateManyArgs>(args: SelectSubset<T, WeddingWebsiteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WeddingWebsites and returns the data updated in the database.
     * @param {WeddingWebsiteUpdateManyAndReturnArgs} args - Arguments to update many WeddingWebsites.
     * @example
     * // Update many WeddingWebsites
     * const weddingWebsite = await prisma.weddingWebsite.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WeddingWebsites and only return the `id`
     * const weddingWebsiteWithIdOnly = await prisma.weddingWebsite.updateManyAndReturn({
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
    updateManyAndReturn<T extends WeddingWebsiteUpdateManyAndReturnArgs>(args: SelectSubset<T, WeddingWebsiteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingWebsitePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WeddingWebsite.
     * @param {WeddingWebsiteUpsertArgs} args - Arguments to update or create a WeddingWebsite.
     * @example
     * // Update or create a WeddingWebsite
     * const weddingWebsite = await prisma.weddingWebsite.upsert({
     *   create: {
     *     // ... data to create a WeddingWebsite
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WeddingWebsite we want to update
     *   }
     * })
     */
    upsert<T extends WeddingWebsiteUpsertArgs>(args: SelectSubset<T, WeddingWebsiteUpsertArgs<ExtArgs>>): Prisma__WeddingWebsiteClient<$Result.GetResult<Prisma.$WeddingWebsitePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WeddingWebsites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingWebsiteCountArgs} args - Arguments to filter WeddingWebsites to count.
     * @example
     * // Count the number of WeddingWebsites
     * const count = await prisma.weddingWebsite.count({
     *   where: {
     *     // ... the filter for the WeddingWebsites we want to count
     *   }
     * })
    **/
    count<T extends WeddingWebsiteCountArgs>(
      args?: Subset<T, WeddingWebsiteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WeddingWebsiteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WeddingWebsite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingWebsiteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends WeddingWebsiteAggregateArgs>(args: Subset<T, WeddingWebsiteAggregateArgs>): Prisma.PrismaPromise<GetWeddingWebsiteAggregateType<T>>

    /**
     * Group by WeddingWebsite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingWebsiteGroupByArgs} args - Group by arguments.
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
      T extends WeddingWebsiteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WeddingWebsiteGroupByArgs['orderBy'] }
        : { orderBy?: WeddingWebsiteGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, WeddingWebsiteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWeddingWebsiteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WeddingWebsite model
   */
  readonly fields: WeddingWebsiteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WeddingWebsite.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WeddingWebsiteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wedding<T extends WeddingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WeddingDefaultArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the WeddingWebsite model
   */
  interface WeddingWebsiteFieldRefs {
    readonly id: FieldRef<"WeddingWebsite", 'String'>
    readonly weddingId: FieldRef<"WeddingWebsite", 'String'>
    readonly slug: FieldRef<"WeddingWebsite", 'String'>
    readonly templateId: FieldRef<"WeddingWebsite", 'String'>
    readonly published: FieldRef<"WeddingWebsite", 'Boolean'>
    readonly publishedAt: FieldRef<"WeddingWebsite", 'DateTime'>
    readonly content: FieldRef<"WeddingWebsite", 'Json'>
    readonly createdAt: FieldRef<"WeddingWebsite", 'DateTime'>
    readonly updatedAt: FieldRef<"WeddingWebsite", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WeddingWebsite findUnique
   */
  export type WeddingWebsiteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingWebsite
     */
    select?: WeddingWebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingWebsite
     */
    omit?: WeddingWebsiteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingWebsiteInclude<ExtArgs> | null
    /**
     * Filter, which WeddingWebsite to fetch.
     */
    where: WeddingWebsiteWhereUniqueInput
  }

  /**
   * WeddingWebsite findUniqueOrThrow
   */
  export type WeddingWebsiteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingWebsite
     */
    select?: WeddingWebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingWebsite
     */
    omit?: WeddingWebsiteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingWebsiteInclude<ExtArgs> | null
    /**
     * Filter, which WeddingWebsite to fetch.
     */
    where: WeddingWebsiteWhereUniqueInput
  }

  /**
   * WeddingWebsite findFirst
   */
  export type WeddingWebsiteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingWebsite
     */
    select?: WeddingWebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingWebsite
     */
    omit?: WeddingWebsiteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingWebsiteInclude<ExtArgs> | null
    /**
     * Filter, which WeddingWebsite to fetch.
     */
    where?: WeddingWebsiteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeddingWebsites to fetch.
     */
    orderBy?: WeddingWebsiteOrderByWithRelationInput | WeddingWebsiteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WeddingWebsites.
     */
    cursor?: WeddingWebsiteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeddingWebsites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeddingWebsites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WeddingWebsites.
     */
    distinct?: WeddingWebsiteScalarFieldEnum | WeddingWebsiteScalarFieldEnum[]
  }

  /**
   * WeddingWebsite findFirstOrThrow
   */
  export type WeddingWebsiteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingWebsite
     */
    select?: WeddingWebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingWebsite
     */
    omit?: WeddingWebsiteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingWebsiteInclude<ExtArgs> | null
    /**
     * Filter, which WeddingWebsite to fetch.
     */
    where?: WeddingWebsiteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeddingWebsites to fetch.
     */
    orderBy?: WeddingWebsiteOrderByWithRelationInput | WeddingWebsiteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WeddingWebsites.
     */
    cursor?: WeddingWebsiteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeddingWebsites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeddingWebsites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WeddingWebsites.
     */
    distinct?: WeddingWebsiteScalarFieldEnum | WeddingWebsiteScalarFieldEnum[]
  }

  /**
   * WeddingWebsite findMany
   */
  export type WeddingWebsiteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingWebsite
     */
    select?: WeddingWebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingWebsite
     */
    omit?: WeddingWebsiteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingWebsiteInclude<ExtArgs> | null
    /**
     * Filter, which WeddingWebsites to fetch.
     */
    where?: WeddingWebsiteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeddingWebsites to fetch.
     */
    orderBy?: WeddingWebsiteOrderByWithRelationInput | WeddingWebsiteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WeddingWebsites.
     */
    cursor?: WeddingWebsiteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeddingWebsites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeddingWebsites.
     */
    skip?: number
    distinct?: WeddingWebsiteScalarFieldEnum | WeddingWebsiteScalarFieldEnum[]
  }

  /**
   * WeddingWebsite create
   */
  export type WeddingWebsiteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingWebsite
     */
    select?: WeddingWebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingWebsite
     */
    omit?: WeddingWebsiteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingWebsiteInclude<ExtArgs> | null
    /**
     * The data needed to create a WeddingWebsite.
     */
    data: XOR<WeddingWebsiteCreateInput, WeddingWebsiteUncheckedCreateInput>
  }

  /**
   * WeddingWebsite createMany
   */
  export type WeddingWebsiteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WeddingWebsites.
     */
    data: WeddingWebsiteCreateManyInput | WeddingWebsiteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WeddingWebsite createManyAndReturn
   */
  export type WeddingWebsiteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingWebsite
     */
    select?: WeddingWebsiteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingWebsite
     */
    omit?: WeddingWebsiteOmit<ExtArgs> | null
    /**
     * The data used to create many WeddingWebsites.
     */
    data: WeddingWebsiteCreateManyInput | WeddingWebsiteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingWebsiteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WeddingWebsite update
   */
  export type WeddingWebsiteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingWebsite
     */
    select?: WeddingWebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingWebsite
     */
    omit?: WeddingWebsiteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingWebsiteInclude<ExtArgs> | null
    /**
     * The data needed to update a WeddingWebsite.
     */
    data: XOR<WeddingWebsiteUpdateInput, WeddingWebsiteUncheckedUpdateInput>
    /**
     * Choose, which WeddingWebsite to update.
     */
    where: WeddingWebsiteWhereUniqueInput
  }

  /**
   * WeddingWebsite updateMany
   */
  export type WeddingWebsiteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WeddingWebsites.
     */
    data: XOR<WeddingWebsiteUpdateManyMutationInput, WeddingWebsiteUncheckedUpdateManyInput>
    /**
     * Filter which WeddingWebsites to update
     */
    where?: WeddingWebsiteWhereInput
    /**
     * Limit how many WeddingWebsites to update.
     */
    limit?: number
  }

  /**
   * WeddingWebsite updateManyAndReturn
   */
  export type WeddingWebsiteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingWebsite
     */
    select?: WeddingWebsiteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingWebsite
     */
    omit?: WeddingWebsiteOmit<ExtArgs> | null
    /**
     * The data used to update WeddingWebsites.
     */
    data: XOR<WeddingWebsiteUpdateManyMutationInput, WeddingWebsiteUncheckedUpdateManyInput>
    /**
     * Filter which WeddingWebsites to update
     */
    where?: WeddingWebsiteWhereInput
    /**
     * Limit how many WeddingWebsites to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingWebsiteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WeddingWebsite upsert
   */
  export type WeddingWebsiteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingWebsite
     */
    select?: WeddingWebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingWebsite
     */
    omit?: WeddingWebsiteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingWebsiteInclude<ExtArgs> | null
    /**
     * The filter to search for the WeddingWebsite to update in case it exists.
     */
    where: WeddingWebsiteWhereUniqueInput
    /**
     * In case the WeddingWebsite found by the `where` argument doesn't exist, create a new WeddingWebsite with this data.
     */
    create: XOR<WeddingWebsiteCreateInput, WeddingWebsiteUncheckedCreateInput>
    /**
     * In case the WeddingWebsite was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WeddingWebsiteUpdateInput, WeddingWebsiteUncheckedUpdateInput>
  }

  /**
   * WeddingWebsite delete
   */
  export type WeddingWebsiteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingWebsite
     */
    select?: WeddingWebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingWebsite
     */
    omit?: WeddingWebsiteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingWebsiteInclude<ExtArgs> | null
    /**
     * Filter which WeddingWebsite to delete.
     */
    where: WeddingWebsiteWhereUniqueInput
  }

  /**
   * WeddingWebsite deleteMany
   */
  export type WeddingWebsiteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WeddingWebsites to delete
     */
    where?: WeddingWebsiteWhereInput
    /**
     * Limit how many WeddingWebsites to delete.
     */
    limit?: number
  }

  /**
   * WeddingWebsite without action
   */
  export type WeddingWebsiteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingWebsite
     */
    select?: WeddingWebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingWebsite
     */
    omit?: WeddingWebsiteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingWebsiteInclude<ExtArgs> | null
  }


  /**
   * Model WeddingInvitation
   */

  export type AggregateWeddingInvitation = {
    _count: WeddingInvitationCountAggregateOutputType | null
    _min: WeddingInvitationMinAggregateOutputType | null
    _max: WeddingInvitationMaxAggregateOutputType | null
  }

  export type WeddingInvitationMinAggregateOutputType = {
    id: string | null
    weddingId: string | null
    templateId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WeddingInvitationMaxAggregateOutputType = {
    id: string | null
    weddingId: string | null
    templateId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WeddingInvitationCountAggregateOutputType = {
    id: number
    weddingId: number
    templateId: number
    content: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WeddingInvitationMinAggregateInputType = {
    id?: true
    weddingId?: true
    templateId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WeddingInvitationMaxAggregateInputType = {
    id?: true
    weddingId?: true
    templateId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WeddingInvitationCountAggregateInputType = {
    id?: true
    weddingId?: true
    templateId?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WeddingInvitationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WeddingInvitation to aggregate.
     */
    where?: WeddingInvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeddingInvitations to fetch.
     */
    orderBy?: WeddingInvitationOrderByWithRelationInput | WeddingInvitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WeddingInvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeddingInvitations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeddingInvitations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WeddingInvitations
    **/
    _count?: true | WeddingInvitationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WeddingInvitationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WeddingInvitationMaxAggregateInputType
  }

  export type GetWeddingInvitationAggregateType<T extends WeddingInvitationAggregateArgs> = {
        [P in keyof T & keyof AggregateWeddingInvitation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWeddingInvitation[P]>
      : GetScalarType<T[P], AggregateWeddingInvitation[P]>
  }




  export type WeddingInvitationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeddingInvitationWhereInput
    orderBy?: WeddingInvitationOrderByWithAggregationInput | WeddingInvitationOrderByWithAggregationInput[]
    by: WeddingInvitationScalarFieldEnum[] | WeddingInvitationScalarFieldEnum
    having?: WeddingInvitationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WeddingInvitationCountAggregateInputType | true
    _min?: WeddingInvitationMinAggregateInputType
    _max?: WeddingInvitationMaxAggregateInputType
  }

  export type WeddingInvitationGroupByOutputType = {
    id: string
    weddingId: string
    templateId: string
    content: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: WeddingInvitationCountAggregateOutputType | null
    _min: WeddingInvitationMinAggregateOutputType | null
    _max: WeddingInvitationMaxAggregateOutputType | null
  }

  type GetWeddingInvitationGroupByPayload<T extends WeddingInvitationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WeddingInvitationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WeddingInvitationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WeddingInvitationGroupByOutputType[P]>
            : GetScalarType<T[P], WeddingInvitationGroupByOutputType[P]>
        }
      >
    >


  export type WeddingInvitationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    templateId?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["weddingInvitation"]>

  export type WeddingInvitationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    templateId?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["weddingInvitation"]>

  export type WeddingInvitationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    templateId?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["weddingInvitation"]>

  export type WeddingInvitationSelectScalar = {
    id?: boolean
    weddingId?: boolean
    templateId?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WeddingInvitationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "weddingId" | "templateId" | "content" | "createdAt" | "updatedAt", ExtArgs["result"]["weddingInvitation"]>
  export type WeddingInvitationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }
  export type WeddingInvitationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }
  export type WeddingInvitationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }

  export type $WeddingInvitationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WeddingInvitation"
    objects: {
      wedding: Prisma.$WeddingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      weddingId: string
      templateId: string
      content: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["weddingInvitation"]>
    composites: {}
  }

  type WeddingInvitationGetPayload<S extends boolean | null | undefined | WeddingInvitationDefaultArgs> = $Result.GetResult<Prisma.$WeddingInvitationPayload, S>

  type WeddingInvitationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WeddingInvitationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WeddingInvitationCountAggregateInputType | true
    }

  export interface WeddingInvitationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WeddingInvitation'], meta: { name: 'WeddingInvitation' } }
    /**
     * Find zero or one WeddingInvitation that matches the filter.
     * @param {WeddingInvitationFindUniqueArgs} args - Arguments to find a WeddingInvitation
     * @example
     * // Get one WeddingInvitation
     * const weddingInvitation = await prisma.weddingInvitation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WeddingInvitationFindUniqueArgs>(args: SelectSubset<T, WeddingInvitationFindUniqueArgs<ExtArgs>>): Prisma__WeddingInvitationClient<$Result.GetResult<Prisma.$WeddingInvitationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WeddingInvitation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WeddingInvitationFindUniqueOrThrowArgs} args - Arguments to find a WeddingInvitation
     * @example
     * // Get one WeddingInvitation
     * const weddingInvitation = await prisma.weddingInvitation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WeddingInvitationFindUniqueOrThrowArgs>(args: SelectSubset<T, WeddingInvitationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WeddingInvitationClient<$Result.GetResult<Prisma.$WeddingInvitationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WeddingInvitation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingInvitationFindFirstArgs} args - Arguments to find a WeddingInvitation
     * @example
     * // Get one WeddingInvitation
     * const weddingInvitation = await prisma.weddingInvitation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WeddingInvitationFindFirstArgs>(args?: SelectSubset<T, WeddingInvitationFindFirstArgs<ExtArgs>>): Prisma__WeddingInvitationClient<$Result.GetResult<Prisma.$WeddingInvitationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WeddingInvitation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingInvitationFindFirstOrThrowArgs} args - Arguments to find a WeddingInvitation
     * @example
     * // Get one WeddingInvitation
     * const weddingInvitation = await prisma.weddingInvitation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WeddingInvitationFindFirstOrThrowArgs>(args?: SelectSubset<T, WeddingInvitationFindFirstOrThrowArgs<ExtArgs>>): Prisma__WeddingInvitationClient<$Result.GetResult<Prisma.$WeddingInvitationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WeddingInvitations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingInvitationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WeddingInvitations
     * const weddingInvitations = await prisma.weddingInvitation.findMany()
     * 
     * // Get first 10 WeddingInvitations
     * const weddingInvitations = await prisma.weddingInvitation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const weddingInvitationWithIdOnly = await prisma.weddingInvitation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WeddingInvitationFindManyArgs>(args?: SelectSubset<T, WeddingInvitationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingInvitationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WeddingInvitation.
     * @param {WeddingInvitationCreateArgs} args - Arguments to create a WeddingInvitation.
     * @example
     * // Create one WeddingInvitation
     * const WeddingInvitation = await prisma.weddingInvitation.create({
     *   data: {
     *     // ... data to create a WeddingInvitation
     *   }
     * })
     * 
     */
    create<T extends WeddingInvitationCreateArgs>(args: SelectSubset<T, WeddingInvitationCreateArgs<ExtArgs>>): Prisma__WeddingInvitationClient<$Result.GetResult<Prisma.$WeddingInvitationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WeddingInvitations.
     * @param {WeddingInvitationCreateManyArgs} args - Arguments to create many WeddingInvitations.
     * @example
     * // Create many WeddingInvitations
     * const weddingInvitation = await prisma.weddingInvitation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WeddingInvitationCreateManyArgs>(args?: SelectSubset<T, WeddingInvitationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WeddingInvitations and returns the data saved in the database.
     * @param {WeddingInvitationCreateManyAndReturnArgs} args - Arguments to create many WeddingInvitations.
     * @example
     * // Create many WeddingInvitations
     * const weddingInvitation = await prisma.weddingInvitation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WeddingInvitations and only return the `id`
     * const weddingInvitationWithIdOnly = await prisma.weddingInvitation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WeddingInvitationCreateManyAndReturnArgs>(args?: SelectSubset<T, WeddingInvitationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingInvitationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WeddingInvitation.
     * @param {WeddingInvitationDeleteArgs} args - Arguments to delete one WeddingInvitation.
     * @example
     * // Delete one WeddingInvitation
     * const WeddingInvitation = await prisma.weddingInvitation.delete({
     *   where: {
     *     // ... filter to delete one WeddingInvitation
     *   }
     * })
     * 
     */
    delete<T extends WeddingInvitationDeleteArgs>(args: SelectSubset<T, WeddingInvitationDeleteArgs<ExtArgs>>): Prisma__WeddingInvitationClient<$Result.GetResult<Prisma.$WeddingInvitationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WeddingInvitation.
     * @param {WeddingInvitationUpdateArgs} args - Arguments to update one WeddingInvitation.
     * @example
     * // Update one WeddingInvitation
     * const weddingInvitation = await prisma.weddingInvitation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WeddingInvitationUpdateArgs>(args: SelectSubset<T, WeddingInvitationUpdateArgs<ExtArgs>>): Prisma__WeddingInvitationClient<$Result.GetResult<Prisma.$WeddingInvitationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WeddingInvitations.
     * @param {WeddingInvitationDeleteManyArgs} args - Arguments to filter WeddingInvitations to delete.
     * @example
     * // Delete a few WeddingInvitations
     * const { count } = await prisma.weddingInvitation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WeddingInvitationDeleteManyArgs>(args?: SelectSubset<T, WeddingInvitationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WeddingInvitations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingInvitationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WeddingInvitations
     * const weddingInvitation = await prisma.weddingInvitation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WeddingInvitationUpdateManyArgs>(args: SelectSubset<T, WeddingInvitationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WeddingInvitations and returns the data updated in the database.
     * @param {WeddingInvitationUpdateManyAndReturnArgs} args - Arguments to update many WeddingInvitations.
     * @example
     * // Update many WeddingInvitations
     * const weddingInvitation = await prisma.weddingInvitation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WeddingInvitations and only return the `id`
     * const weddingInvitationWithIdOnly = await prisma.weddingInvitation.updateManyAndReturn({
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
    updateManyAndReturn<T extends WeddingInvitationUpdateManyAndReturnArgs>(args: SelectSubset<T, WeddingInvitationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingInvitationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WeddingInvitation.
     * @param {WeddingInvitationUpsertArgs} args - Arguments to update or create a WeddingInvitation.
     * @example
     * // Update or create a WeddingInvitation
     * const weddingInvitation = await prisma.weddingInvitation.upsert({
     *   create: {
     *     // ... data to create a WeddingInvitation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WeddingInvitation we want to update
     *   }
     * })
     */
    upsert<T extends WeddingInvitationUpsertArgs>(args: SelectSubset<T, WeddingInvitationUpsertArgs<ExtArgs>>): Prisma__WeddingInvitationClient<$Result.GetResult<Prisma.$WeddingInvitationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WeddingInvitations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingInvitationCountArgs} args - Arguments to filter WeddingInvitations to count.
     * @example
     * // Count the number of WeddingInvitations
     * const count = await prisma.weddingInvitation.count({
     *   where: {
     *     // ... the filter for the WeddingInvitations we want to count
     *   }
     * })
    **/
    count<T extends WeddingInvitationCountArgs>(
      args?: Subset<T, WeddingInvitationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WeddingInvitationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WeddingInvitation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingInvitationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends WeddingInvitationAggregateArgs>(args: Subset<T, WeddingInvitationAggregateArgs>): Prisma.PrismaPromise<GetWeddingInvitationAggregateType<T>>

    /**
     * Group by WeddingInvitation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingInvitationGroupByArgs} args - Group by arguments.
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
      T extends WeddingInvitationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WeddingInvitationGroupByArgs['orderBy'] }
        : { orderBy?: WeddingInvitationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, WeddingInvitationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWeddingInvitationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WeddingInvitation model
   */
  readonly fields: WeddingInvitationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WeddingInvitation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WeddingInvitationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wedding<T extends WeddingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WeddingDefaultArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the WeddingInvitation model
   */
  interface WeddingInvitationFieldRefs {
    readonly id: FieldRef<"WeddingInvitation", 'String'>
    readonly weddingId: FieldRef<"WeddingInvitation", 'String'>
    readonly templateId: FieldRef<"WeddingInvitation", 'String'>
    readonly content: FieldRef<"WeddingInvitation", 'Json'>
    readonly createdAt: FieldRef<"WeddingInvitation", 'DateTime'>
    readonly updatedAt: FieldRef<"WeddingInvitation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WeddingInvitation findUnique
   */
  export type WeddingInvitationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvitation
     */
    select?: WeddingInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvitation
     */
    omit?: WeddingInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInvitationInclude<ExtArgs> | null
    /**
     * Filter, which WeddingInvitation to fetch.
     */
    where: WeddingInvitationWhereUniqueInput
  }

  /**
   * WeddingInvitation findUniqueOrThrow
   */
  export type WeddingInvitationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvitation
     */
    select?: WeddingInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvitation
     */
    omit?: WeddingInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInvitationInclude<ExtArgs> | null
    /**
     * Filter, which WeddingInvitation to fetch.
     */
    where: WeddingInvitationWhereUniqueInput
  }

  /**
   * WeddingInvitation findFirst
   */
  export type WeddingInvitationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvitation
     */
    select?: WeddingInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvitation
     */
    omit?: WeddingInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInvitationInclude<ExtArgs> | null
    /**
     * Filter, which WeddingInvitation to fetch.
     */
    where?: WeddingInvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeddingInvitations to fetch.
     */
    orderBy?: WeddingInvitationOrderByWithRelationInput | WeddingInvitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WeddingInvitations.
     */
    cursor?: WeddingInvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeddingInvitations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeddingInvitations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WeddingInvitations.
     */
    distinct?: WeddingInvitationScalarFieldEnum | WeddingInvitationScalarFieldEnum[]
  }

  /**
   * WeddingInvitation findFirstOrThrow
   */
  export type WeddingInvitationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvitation
     */
    select?: WeddingInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvitation
     */
    omit?: WeddingInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInvitationInclude<ExtArgs> | null
    /**
     * Filter, which WeddingInvitation to fetch.
     */
    where?: WeddingInvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeddingInvitations to fetch.
     */
    orderBy?: WeddingInvitationOrderByWithRelationInput | WeddingInvitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WeddingInvitations.
     */
    cursor?: WeddingInvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeddingInvitations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeddingInvitations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WeddingInvitations.
     */
    distinct?: WeddingInvitationScalarFieldEnum | WeddingInvitationScalarFieldEnum[]
  }

  /**
   * WeddingInvitation findMany
   */
  export type WeddingInvitationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvitation
     */
    select?: WeddingInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvitation
     */
    omit?: WeddingInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInvitationInclude<ExtArgs> | null
    /**
     * Filter, which WeddingInvitations to fetch.
     */
    where?: WeddingInvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeddingInvitations to fetch.
     */
    orderBy?: WeddingInvitationOrderByWithRelationInput | WeddingInvitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WeddingInvitations.
     */
    cursor?: WeddingInvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeddingInvitations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeddingInvitations.
     */
    skip?: number
    distinct?: WeddingInvitationScalarFieldEnum | WeddingInvitationScalarFieldEnum[]
  }

  /**
   * WeddingInvitation create
   */
  export type WeddingInvitationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvitation
     */
    select?: WeddingInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvitation
     */
    omit?: WeddingInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInvitationInclude<ExtArgs> | null
    /**
     * The data needed to create a WeddingInvitation.
     */
    data: XOR<WeddingInvitationCreateInput, WeddingInvitationUncheckedCreateInput>
  }

  /**
   * WeddingInvitation createMany
   */
  export type WeddingInvitationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WeddingInvitations.
     */
    data: WeddingInvitationCreateManyInput | WeddingInvitationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WeddingInvitation createManyAndReturn
   */
  export type WeddingInvitationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvitation
     */
    select?: WeddingInvitationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvitation
     */
    omit?: WeddingInvitationOmit<ExtArgs> | null
    /**
     * The data used to create many WeddingInvitations.
     */
    data: WeddingInvitationCreateManyInput | WeddingInvitationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInvitationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WeddingInvitation update
   */
  export type WeddingInvitationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvitation
     */
    select?: WeddingInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvitation
     */
    omit?: WeddingInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInvitationInclude<ExtArgs> | null
    /**
     * The data needed to update a WeddingInvitation.
     */
    data: XOR<WeddingInvitationUpdateInput, WeddingInvitationUncheckedUpdateInput>
    /**
     * Choose, which WeddingInvitation to update.
     */
    where: WeddingInvitationWhereUniqueInput
  }

  /**
   * WeddingInvitation updateMany
   */
  export type WeddingInvitationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WeddingInvitations.
     */
    data: XOR<WeddingInvitationUpdateManyMutationInput, WeddingInvitationUncheckedUpdateManyInput>
    /**
     * Filter which WeddingInvitations to update
     */
    where?: WeddingInvitationWhereInput
    /**
     * Limit how many WeddingInvitations to update.
     */
    limit?: number
  }

  /**
   * WeddingInvitation updateManyAndReturn
   */
  export type WeddingInvitationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvitation
     */
    select?: WeddingInvitationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvitation
     */
    omit?: WeddingInvitationOmit<ExtArgs> | null
    /**
     * The data used to update WeddingInvitations.
     */
    data: XOR<WeddingInvitationUpdateManyMutationInput, WeddingInvitationUncheckedUpdateManyInput>
    /**
     * Filter which WeddingInvitations to update
     */
    where?: WeddingInvitationWhereInput
    /**
     * Limit how many WeddingInvitations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInvitationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WeddingInvitation upsert
   */
  export type WeddingInvitationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvitation
     */
    select?: WeddingInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvitation
     */
    omit?: WeddingInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInvitationInclude<ExtArgs> | null
    /**
     * The filter to search for the WeddingInvitation to update in case it exists.
     */
    where: WeddingInvitationWhereUniqueInput
    /**
     * In case the WeddingInvitation found by the `where` argument doesn't exist, create a new WeddingInvitation with this data.
     */
    create: XOR<WeddingInvitationCreateInput, WeddingInvitationUncheckedCreateInput>
    /**
     * In case the WeddingInvitation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WeddingInvitationUpdateInput, WeddingInvitationUncheckedUpdateInput>
  }

  /**
   * WeddingInvitation delete
   */
  export type WeddingInvitationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvitation
     */
    select?: WeddingInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvitation
     */
    omit?: WeddingInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInvitationInclude<ExtArgs> | null
    /**
     * Filter which WeddingInvitation to delete.
     */
    where: WeddingInvitationWhereUniqueInput
  }

  /**
   * WeddingInvitation deleteMany
   */
  export type WeddingInvitationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WeddingInvitations to delete
     */
    where?: WeddingInvitationWhereInput
    /**
     * Limit how many WeddingInvitations to delete.
     */
    limit?: number
  }

  /**
   * WeddingInvitation without action
   */
  export type WeddingInvitationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvitation
     */
    select?: WeddingInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvitation
     */
    omit?: WeddingInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInvitationInclude<ExtArgs> | null
  }


  /**
   * Model WeddingMember
   */

  export type AggregateWeddingMember = {
    _count: WeddingMemberCountAggregateOutputType | null
    _min: WeddingMemberMinAggregateOutputType | null
    _max: WeddingMemberMaxAggregateOutputType | null
  }

  export type WeddingMemberMinAggregateOutputType = {
    id: string | null
    weddingId: string | null
    userId: string | null
    role: $Enums.WeddingMemberRole | null
    createdAt: Date | null
  }

  export type WeddingMemberMaxAggregateOutputType = {
    id: string | null
    weddingId: string | null
    userId: string | null
    role: $Enums.WeddingMemberRole | null
    createdAt: Date | null
  }

  export type WeddingMemberCountAggregateOutputType = {
    id: number
    weddingId: number
    userId: number
    role: number
    createdAt: number
    _all: number
  }


  export type WeddingMemberMinAggregateInputType = {
    id?: true
    weddingId?: true
    userId?: true
    role?: true
    createdAt?: true
  }

  export type WeddingMemberMaxAggregateInputType = {
    id?: true
    weddingId?: true
    userId?: true
    role?: true
    createdAt?: true
  }

  export type WeddingMemberCountAggregateInputType = {
    id?: true
    weddingId?: true
    userId?: true
    role?: true
    createdAt?: true
    _all?: true
  }

  export type WeddingMemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WeddingMember to aggregate.
     */
    where?: WeddingMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeddingMembers to fetch.
     */
    orderBy?: WeddingMemberOrderByWithRelationInput | WeddingMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WeddingMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeddingMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeddingMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WeddingMembers
    **/
    _count?: true | WeddingMemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WeddingMemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WeddingMemberMaxAggregateInputType
  }

  export type GetWeddingMemberAggregateType<T extends WeddingMemberAggregateArgs> = {
        [P in keyof T & keyof AggregateWeddingMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWeddingMember[P]>
      : GetScalarType<T[P], AggregateWeddingMember[P]>
  }




  export type WeddingMemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeddingMemberWhereInput
    orderBy?: WeddingMemberOrderByWithAggregationInput | WeddingMemberOrderByWithAggregationInput[]
    by: WeddingMemberScalarFieldEnum[] | WeddingMemberScalarFieldEnum
    having?: WeddingMemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WeddingMemberCountAggregateInputType | true
    _min?: WeddingMemberMinAggregateInputType
    _max?: WeddingMemberMaxAggregateInputType
  }

  export type WeddingMemberGroupByOutputType = {
    id: string
    weddingId: string
    userId: string
    role: $Enums.WeddingMemberRole
    createdAt: Date
    _count: WeddingMemberCountAggregateOutputType | null
    _min: WeddingMemberMinAggregateOutputType | null
    _max: WeddingMemberMaxAggregateOutputType | null
  }

  type GetWeddingMemberGroupByPayload<T extends WeddingMemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WeddingMemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WeddingMemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WeddingMemberGroupByOutputType[P]>
            : GetScalarType<T[P], WeddingMemberGroupByOutputType[P]>
        }
      >
    >


  export type WeddingMemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    userId?: boolean
    role?: boolean
    createdAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["weddingMember"]>

  export type WeddingMemberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    userId?: boolean
    role?: boolean
    createdAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["weddingMember"]>

  export type WeddingMemberSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    userId?: boolean
    role?: boolean
    createdAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["weddingMember"]>

  export type WeddingMemberSelectScalar = {
    id?: boolean
    weddingId?: boolean
    userId?: boolean
    role?: boolean
    createdAt?: boolean
  }

  export type WeddingMemberOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "weddingId" | "userId" | "role" | "createdAt", ExtArgs["result"]["weddingMember"]>
  export type WeddingMemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type WeddingMemberIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type WeddingMemberIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $WeddingMemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WeddingMember"
    objects: {
      wedding: Prisma.$WeddingPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      weddingId: string
      userId: string
      role: $Enums.WeddingMemberRole
      createdAt: Date
    }, ExtArgs["result"]["weddingMember"]>
    composites: {}
  }

  type WeddingMemberGetPayload<S extends boolean | null | undefined | WeddingMemberDefaultArgs> = $Result.GetResult<Prisma.$WeddingMemberPayload, S>

  type WeddingMemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WeddingMemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WeddingMemberCountAggregateInputType | true
    }

  export interface WeddingMemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WeddingMember'], meta: { name: 'WeddingMember' } }
    /**
     * Find zero or one WeddingMember that matches the filter.
     * @param {WeddingMemberFindUniqueArgs} args - Arguments to find a WeddingMember
     * @example
     * // Get one WeddingMember
     * const weddingMember = await prisma.weddingMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WeddingMemberFindUniqueArgs>(args: SelectSubset<T, WeddingMemberFindUniqueArgs<ExtArgs>>): Prisma__WeddingMemberClient<$Result.GetResult<Prisma.$WeddingMemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WeddingMember that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WeddingMemberFindUniqueOrThrowArgs} args - Arguments to find a WeddingMember
     * @example
     * // Get one WeddingMember
     * const weddingMember = await prisma.weddingMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WeddingMemberFindUniqueOrThrowArgs>(args: SelectSubset<T, WeddingMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WeddingMemberClient<$Result.GetResult<Prisma.$WeddingMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WeddingMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingMemberFindFirstArgs} args - Arguments to find a WeddingMember
     * @example
     * // Get one WeddingMember
     * const weddingMember = await prisma.weddingMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WeddingMemberFindFirstArgs>(args?: SelectSubset<T, WeddingMemberFindFirstArgs<ExtArgs>>): Prisma__WeddingMemberClient<$Result.GetResult<Prisma.$WeddingMemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WeddingMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingMemberFindFirstOrThrowArgs} args - Arguments to find a WeddingMember
     * @example
     * // Get one WeddingMember
     * const weddingMember = await prisma.weddingMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WeddingMemberFindFirstOrThrowArgs>(args?: SelectSubset<T, WeddingMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma__WeddingMemberClient<$Result.GetResult<Prisma.$WeddingMemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WeddingMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WeddingMembers
     * const weddingMembers = await prisma.weddingMember.findMany()
     * 
     * // Get first 10 WeddingMembers
     * const weddingMembers = await prisma.weddingMember.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const weddingMemberWithIdOnly = await prisma.weddingMember.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WeddingMemberFindManyArgs>(args?: SelectSubset<T, WeddingMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WeddingMember.
     * @param {WeddingMemberCreateArgs} args - Arguments to create a WeddingMember.
     * @example
     * // Create one WeddingMember
     * const WeddingMember = await prisma.weddingMember.create({
     *   data: {
     *     // ... data to create a WeddingMember
     *   }
     * })
     * 
     */
    create<T extends WeddingMemberCreateArgs>(args: SelectSubset<T, WeddingMemberCreateArgs<ExtArgs>>): Prisma__WeddingMemberClient<$Result.GetResult<Prisma.$WeddingMemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WeddingMembers.
     * @param {WeddingMemberCreateManyArgs} args - Arguments to create many WeddingMembers.
     * @example
     * // Create many WeddingMembers
     * const weddingMember = await prisma.weddingMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WeddingMemberCreateManyArgs>(args?: SelectSubset<T, WeddingMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WeddingMembers and returns the data saved in the database.
     * @param {WeddingMemberCreateManyAndReturnArgs} args - Arguments to create many WeddingMembers.
     * @example
     * // Create many WeddingMembers
     * const weddingMember = await prisma.weddingMember.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WeddingMembers and only return the `id`
     * const weddingMemberWithIdOnly = await prisma.weddingMember.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WeddingMemberCreateManyAndReturnArgs>(args?: SelectSubset<T, WeddingMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingMemberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WeddingMember.
     * @param {WeddingMemberDeleteArgs} args - Arguments to delete one WeddingMember.
     * @example
     * // Delete one WeddingMember
     * const WeddingMember = await prisma.weddingMember.delete({
     *   where: {
     *     // ... filter to delete one WeddingMember
     *   }
     * })
     * 
     */
    delete<T extends WeddingMemberDeleteArgs>(args: SelectSubset<T, WeddingMemberDeleteArgs<ExtArgs>>): Prisma__WeddingMemberClient<$Result.GetResult<Prisma.$WeddingMemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WeddingMember.
     * @param {WeddingMemberUpdateArgs} args - Arguments to update one WeddingMember.
     * @example
     * // Update one WeddingMember
     * const weddingMember = await prisma.weddingMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WeddingMemberUpdateArgs>(args: SelectSubset<T, WeddingMemberUpdateArgs<ExtArgs>>): Prisma__WeddingMemberClient<$Result.GetResult<Prisma.$WeddingMemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WeddingMembers.
     * @param {WeddingMemberDeleteManyArgs} args - Arguments to filter WeddingMembers to delete.
     * @example
     * // Delete a few WeddingMembers
     * const { count } = await prisma.weddingMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WeddingMemberDeleteManyArgs>(args?: SelectSubset<T, WeddingMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WeddingMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WeddingMembers
     * const weddingMember = await prisma.weddingMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WeddingMemberUpdateManyArgs>(args: SelectSubset<T, WeddingMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WeddingMembers and returns the data updated in the database.
     * @param {WeddingMemberUpdateManyAndReturnArgs} args - Arguments to update many WeddingMembers.
     * @example
     * // Update many WeddingMembers
     * const weddingMember = await prisma.weddingMember.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WeddingMembers and only return the `id`
     * const weddingMemberWithIdOnly = await prisma.weddingMember.updateManyAndReturn({
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
    updateManyAndReturn<T extends WeddingMemberUpdateManyAndReturnArgs>(args: SelectSubset<T, WeddingMemberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingMemberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WeddingMember.
     * @param {WeddingMemberUpsertArgs} args - Arguments to update or create a WeddingMember.
     * @example
     * // Update or create a WeddingMember
     * const weddingMember = await prisma.weddingMember.upsert({
     *   create: {
     *     // ... data to create a WeddingMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WeddingMember we want to update
     *   }
     * })
     */
    upsert<T extends WeddingMemberUpsertArgs>(args: SelectSubset<T, WeddingMemberUpsertArgs<ExtArgs>>): Prisma__WeddingMemberClient<$Result.GetResult<Prisma.$WeddingMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WeddingMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingMemberCountArgs} args - Arguments to filter WeddingMembers to count.
     * @example
     * // Count the number of WeddingMembers
     * const count = await prisma.weddingMember.count({
     *   where: {
     *     // ... the filter for the WeddingMembers we want to count
     *   }
     * })
    **/
    count<T extends WeddingMemberCountArgs>(
      args?: Subset<T, WeddingMemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WeddingMemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WeddingMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends WeddingMemberAggregateArgs>(args: Subset<T, WeddingMemberAggregateArgs>): Prisma.PrismaPromise<GetWeddingMemberAggregateType<T>>

    /**
     * Group by WeddingMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingMemberGroupByArgs} args - Group by arguments.
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
      T extends WeddingMemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WeddingMemberGroupByArgs['orderBy'] }
        : { orderBy?: WeddingMemberGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, WeddingMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWeddingMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WeddingMember model
   */
  readonly fields: WeddingMemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WeddingMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WeddingMemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wedding<T extends WeddingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WeddingDefaultArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the WeddingMember model
   */
  interface WeddingMemberFieldRefs {
    readonly id: FieldRef<"WeddingMember", 'String'>
    readonly weddingId: FieldRef<"WeddingMember", 'String'>
    readonly userId: FieldRef<"WeddingMember", 'String'>
    readonly role: FieldRef<"WeddingMember", 'WeddingMemberRole'>
    readonly createdAt: FieldRef<"WeddingMember", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WeddingMember findUnique
   */
  export type WeddingMemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingMember
     */
    select?: WeddingMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingMember
     */
    omit?: WeddingMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingMemberInclude<ExtArgs> | null
    /**
     * Filter, which WeddingMember to fetch.
     */
    where: WeddingMemberWhereUniqueInput
  }

  /**
   * WeddingMember findUniqueOrThrow
   */
  export type WeddingMemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingMember
     */
    select?: WeddingMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingMember
     */
    omit?: WeddingMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingMemberInclude<ExtArgs> | null
    /**
     * Filter, which WeddingMember to fetch.
     */
    where: WeddingMemberWhereUniqueInput
  }

  /**
   * WeddingMember findFirst
   */
  export type WeddingMemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingMember
     */
    select?: WeddingMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingMember
     */
    omit?: WeddingMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingMemberInclude<ExtArgs> | null
    /**
     * Filter, which WeddingMember to fetch.
     */
    where?: WeddingMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeddingMembers to fetch.
     */
    orderBy?: WeddingMemberOrderByWithRelationInput | WeddingMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WeddingMembers.
     */
    cursor?: WeddingMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeddingMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeddingMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WeddingMembers.
     */
    distinct?: WeddingMemberScalarFieldEnum | WeddingMemberScalarFieldEnum[]
  }

  /**
   * WeddingMember findFirstOrThrow
   */
  export type WeddingMemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingMember
     */
    select?: WeddingMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingMember
     */
    omit?: WeddingMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingMemberInclude<ExtArgs> | null
    /**
     * Filter, which WeddingMember to fetch.
     */
    where?: WeddingMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeddingMembers to fetch.
     */
    orderBy?: WeddingMemberOrderByWithRelationInput | WeddingMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WeddingMembers.
     */
    cursor?: WeddingMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeddingMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeddingMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WeddingMembers.
     */
    distinct?: WeddingMemberScalarFieldEnum | WeddingMemberScalarFieldEnum[]
  }

  /**
   * WeddingMember findMany
   */
  export type WeddingMemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingMember
     */
    select?: WeddingMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingMember
     */
    omit?: WeddingMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingMemberInclude<ExtArgs> | null
    /**
     * Filter, which WeddingMembers to fetch.
     */
    where?: WeddingMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeddingMembers to fetch.
     */
    orderBy?: WeddingMemberOrderByWithRelationInput | WeddingMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WeddingMembers.
     */
    cursor?: WeddingMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeddingMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeddingMembers.
     */
    skip?: number
    distinct?: WeddingMemberScalarFieldEnum | WeddingMemberScalarFieldEnum[]
  }

  /**
   * WeddingMember create
   */
  export type WeddingMemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingMember
     */
    select?: WeddingMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingMember
     */
    omit?: WeddingMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingMemberInclude<ExtArgs> | null
    /**
     * The data needed to create a WeddingMember.
     */
    data: XOR<WeddingMemberCreateInput, WeddingMemberUncheckedCreateInput>
  }

  /**
   * WeddingMember createMany
   */
  export type WeddingMemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WeddingMembers.
     */
    data: WeddingMemberCreateManyInput | WeddingMemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WeddingMember createManyAndReturn
   */
  export type WeddingMemberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingMember
     */
    select?: WeddingMemberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingMember
     */
    omit?: WeddingMemberOmit<ExtArgs> | null
    /**
     * The data used to create many WeddingMembers.
     */
    data: WeddingMemberCreateManyInput | WeddingMemberCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingMemberIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WeddingMember update
   */
  export type WeddingMemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingMember
     */
    select?: WeddingMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingMember
     */
    omit?: WeddingMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingMemberInclude<ExtArgs> | null
    /**
     * The data needed to update a WeddingMember.
     */
    data: XOR<WeddingMemberUpdateInput, WeddingMemberUncheckedUpdateInput>
    /**
     * Choose, which WeddingMember to update.
     */
    where: WeddingMemberWhereUniqueInput
  }

  /**
   * WeddingMember updateMany
   */
  export type WeddingMemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WeddingMembers.
     */
    data: XOR<WeddingMemberUpdateManyMutationInput, WeddingMemberUncheckedUpdateManyInput>
    /**
     * Filter which WeddingMembers to update
     */
    where?: WeddingMemberWhereInput
    /**
     * Limit how many WeddingMembers to update.
     */
    limit?: number
  }

  /**
   * WeddingMember updateManyAndReturn
   */
  export type WeddingMemberUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingMember
     */
    select?: WeddingMemberSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingMember
     */
    omit?: WeddingMemberOmit<ExtArgs> | null
    /**
     * The data used to update WeddingMembers.
     */
    data: XOR<WeddingMemberUpdateManyMutationInput, WeddingMemberUncheckedUpdateManyInput>
    /**
     * Filter which WeddingMembers to update
     */
    where?: WeddingMemberWhereInput
    /**
     * Limit how many WeddingMembers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingMemberIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WeddingMember upsert
   */
  export type WeddingMemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingMember
     */
    select?: WeddingMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingMember
     */
    omit?: WeddingMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingMemberInclude<ExtArgs> | null
    /**
     * The filter to search for the WeddingMember to update in case it exists.
     */
    where: WeddingMemberWhereUniqueInput
    /**
     * In case the WeddingMember found by the `where` argument doesn't exist, create a new WeddingMember with this data.
     */
    create: XOR<WeddingMemberCreateInput, WeddingMemberUncheckedCreateInput>
    /**
     * In case the WeddingMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WeddingMemberUpdateInput, WeddingMemberUncheckedUpdateInput>
  }

  /**
   * WeddingMember delete
   */
  export type WeddingMemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingMember
     */
    select?: WeddingMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingMember
     */
    omit?: WeddingMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingMemberInclude<ExtArgs> | null
    /**
     * Filter which WeddingMember to delete.
     */
    where: WeddingMemberWhereUniqueInput
  }

  /**
   * WeddingMember deleteMany
   */
  export type WeddingMemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WeddingMembers to delete
     */
    where?: WeddingMemberWhereInput
    /**
     * Limit how many WeddingMembers to delete.
     */
    limit?: number
  }

  /**
   * WeddingMember without action
   */
  export type WeddingMemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingMember
     */
    select?: WeddingMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingMember
     */
    omit?: WeddingMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingMemberInclude<ExtArgs> | null
  }


  /**
   * Model WeddingInvite
   */

  export type AggregateWeddingInvite = {
    _count: WeddingInviteCountAggregateOutputType | null
    _min: WeddingInviteMinAggregateOutputType | null
    _max: WeddingInviteMaxAggregateOutputType | null
  }

  export type WeddingInviteMinAggregateOutputType = {
    id: string | null
    weddingId: string | null
    token: string | null
    expiresAt: Date | null
    acceptedAt: Date | null
    acceptedBy: string | null
    createdAt: Date | null
  }

  export type WeddingInviteMaxAggregateOutputType = {
    id: string | null
    weddingId: string | null
    token: string | null
    expiresAt: Date | null
    acceptedAt: Date | null
    acceptedBy: string | null
    createdAt: Date | null
  }

  export type WeddingInviteCountAggregateOutputType = {
    id: number
    weddingId: number
    token: number
    expiresAt: number
    acceptedAt: number
    acceptedBy: number
    createdAt: number
    _all: number
  }


  export type WeddingInviteMinAggregateInputType = {
    id?: true
    weddingId?: true
    token?: true
    expiresAt?: true
    acceptedAt?: true
    acceptedBy?: true
    createdAt?: true
  }

  export type WeddingInviteMaxAggregateInputType = {
    id?: true
    weddingId?: true
    token?: true
    expiresAt?: true
    acceptedAt?: true
    acceptedBy?: true
    createdAt?: true
  }

  export type WeddingInviteCountAggregateInputType = {
    id?: true
    weddingId?: true
    token?: true
    expiresAt?: true
    acceptedAt?: true
    acceptedBy?: true
    createdAt?: true
    _all?: true
  }

  export type WeddingInviteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WeddingInvite to aggregate.
     */
    where?: WeddingInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeddingInvites to fetch.
     */
    orderBy?: WeddingInviteOrderByWithRelationInput | WeddingInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WeddingInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeddingInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeddingInvites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WeddingInvites
    **/
    _count?: true | WeddingInviteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WeddingInviteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WeddingInviteMaxAggregateInputType
  }

  export type GetWeddingInviteAggregateType<T extends WeddingInviteAggregateArgs> = {
        [P in keyof T & keyof AggregateWeddingInvite]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWeddingInvite[P]>
      : GetScalarType<T[P], AggregateWeddingInvite[P]>
  }




  export type WeddingInviteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeddingInviteWhereInput
    orderBy?: WeddingInviteOrderByWithAggregationInput | WeddingInviteOrderByWithAggregationInput[]
    by: WeddingInviteScalarFieldEnum[] | WeddingInviteScalarFieldEnum
    having?: WeddingInviteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WeddingInviteCountAggregateInputType | true
    _min?: WeddingInviteMinAggregateInputType
    _max?: WeddingInviteMaxAggregateInputType
  }

  export type WeddingInviteGroupByOutputType = {
    id: string
    weddingId: string
    token: string
    expiresAt: Date
    acceptedAt: Date | null
    acceptedBy: string | null
    createdAt: Date
    _count: WeddingInviteCountAggregateOutputType | null
    _min: WeddingInviteMinAggregateOutputType | null
    _max: WeddingInviteMaxAggregateOutputType | null
  }

  type GetWeddingInviteGroupByPayload<T extends WeddingInviteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WeddingInviteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WeddingInviteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WeddingInviteGroupByOutputType[P]>
            : GetScalarType<T[P], WeddingInviteGroupByOutputType[P]>
        }
      >
    >


  export type WeddingInviteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    token?: boolean
    expiresAt?: boolean
    acceptedAt?: boolean
    acceptedBy?: boolean
    createdAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["weddingInvite"]>

  export type WeddingInviteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    token?: boolean
    expiresAt?: boolean
    acceptedAt?: boolean
    acceptedBy?: boolean
    createdAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["weddingInvite"]>

  export type WeddingInviteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    token?: boolean
    expiresAt?: boolean
    acceptedAt?: boolean
    acceptedBy?: boolean
    createdAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["weddingInvite"]>

  export type WeddingInviteSelectScalar = {
    id?: boolean
    weddingId?: boolean
    token?: boolean
    expiresAt?: boolean
    acceptedAt?: boolean
    acceptedBy?: boolean
    createdAt?: boolean
  }

  export type WeddingInviteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "weddingId" | "token" | "expiresAt" | "acceptedAt" | "acceptedBy" | "createdAt", ExtArgs["result"]["weddingInvite"]>
  export type WeddingInviteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }
  export type WeddingInviteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }
  export type WeddingInviteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }

  export type $WeddingInvitePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WeddingInvite"
    objects: {
      wedding: Prisma.$WeddingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      weddingId: string
      token: string
      expiresAt: Date
      acceptedAt: Date | null
      acceptedBy: string | null
      createdAt: Date
    }, ExtArgs["result"]["weddingInvite"]>
    composites: {}
  }

  type WeddingInviteGetPayload<S extends boolean | null | undefined | WeddingInviteDefaultArgs> = $Result.GetResult<Prisma.$WeddingInvitePayload, S>

  type WeddingInviteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WeddingInviteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WeddingInviteCountAggregateInputType | true
    }

  export interface WeddingInviteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WeddingInvite'], meta: { name: 'WeddingInvite' } }
    /**
     * Find zero or one WeddingInvite that matches the filter.
     * @param {WeddingInviteFindUniqueArgs} args - Arguments to find a WeddingInvite
     * @example
     * // Get one WeddingInvite
     * const weddingInvite = await prisma.weddingInvite.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WeddingInviteFindUniqueArgs>(args: SelectSubset<T, WeddingInviteFindUniqueArgs<ExtArgs>>): Prisma__WeddingInviteClient<$Result.GetResult<Prisma.$WeddingInvitePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WeddingInvite that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WeddingInviteFindUniqueOrThrowArgs} args - Arguments to find a WeddingInvite
     * @example
     * // Get one WeddingInvite
     * const weddingInvite = await prisma.weddingInvite.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WeddingInviteFindUniqueOrThrowArgs>(args: SelectSubset<T, WeddingInviteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WeddingInviteClient<$Result.GetResult<Prisma.$WeddingInvitePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WeddingInvite that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingInviteFindFirstArgs} args - Arguments to find a WeddingInvite
     * @example
     * // Get one WeddingInvite
     * const weddingInvite = await prisma.weddingInvite.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WeddingInviteFindFirstArgs>(args?: SelectSubset<T, WeddingInviteFindFirstArgs<ExtArgs>>): Prisma__WeddingInviteClient<$Result.GetResult<Prisma.$WeddingInvitePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WeddingInvite that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingInviteFindFirstOrThrowArgs} args - Arguments to find a WeddingInvite
     * @example
     * // Get one WeddingInvite
     * const weddingInvite = await prisma.weddingInvite.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WeddingInviteFindFirstOrThrowArgs>(args?: SelectSubset<T, WeddingInviteFindFirstOrThrowArgs<ExtArgs>>): Prisma__WeddingInviteClient<$Result.GetResult<Prisma.$WeddingInvitePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WeddingInvites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingInviteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WeddingInvites
     * const weddingInvites = await prisma.weddingInvite.findMany()
     * 
     * // Get first 10 WeddingInvites
     * const weddingInvites = await prisma.weddingInvite.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const weddingInviteWithIdOnly = await prisma.weddingInvite.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WeddingInviteFindManyArgs>(args?: SelectSubset<T, WeddingInviteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingInvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WeddingInvite.
     * @param {WeddingInviteCreateArgs} args - Arguments to create a WeddingInvite.
     * @example
     * // Create one WeddingInvite
     * const WeddingInvite = await prisma.weddingInvite.create({
     *   data: {
     *     // ... data to create a WeddingInvite
     *   }
     * })
     * 
     */
    create<T extends WeddingInviteCreateArgs>(args: SelectSubset<T, WeddingInviteCreateArgs<ExtArgs>>): Prisma__WeddingInviteClient<$Result.GetResult<Prisma.$WeddingInvitePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WeddingInvites.
     * @param {WeddingInviteCreateManyArgs} args - Arguments to create many WeddingInvites.
     * @example
     * // Create many WeddingInvites
     * const weddingInvite = await prisma.weddingInvite.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WeddingInviteCreateManyArgs>(args?: SelectSubset<T, WeddingInviteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WeddingInvites and returns the data saved in the database.
     * @param {WeddingInviteCreateManyAndReturnArgs} args - Arguments to create many WeddingInvites.
     * @example
     * // Create many WeddingInvites
     * const weddingInvite = await prisma.weddingInvite.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WeddingInvites and only return the `id`
     * const weddingInviteWithIdOnly = await prisma.weddingInvite.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WeddingInviteCreateManyAndReturnArgs>(args?: SelectSubset<T, WeddingInviteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingInvitePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WeddingInvite.
     * @param {WeddingInviteDeleteArgs} args - Arguments to delete one WeddingInvite.
     * @example
     * // Delete one WeddingInvite
     * const WeddingInvite = await prisma.weddingInvite.delete({
     *   where: {
     *     // ... filter to delete one WeddingInvite
     *   }
     * })
     * 
     */
    delete<T extends WeddingInviteDeleteArgs>(args: SelectSubset<T, WeddingInviteDeleteArgs<ExtArgs>>): Prisma__WeddingInviteClient<$Result.GetResult<Prisma.$WeddingInvitePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WeddingInvite.
     * @param {WeddingInviteUpdateArgs} args - Arguments to update one WeddingInvite.
     * @example
     * // Update one WeddingInvite
     * const weddingInvite = await prisma.weddingInvite.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WeddingInviteUpdateArgs>(args: SelectSubset<T, WeddingInviteUpdateArgs<ExtArgs>>): Prisma__WeddingInviteClient<$Result.GetResult<Prisma.$WeddingInvitePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WeddingInvites.
     * @param {WeddingInviteDeleteManyArgs} args - Arguments to filter WeddingInvites to delete.
     * @example
     * // Delete a few WeddingInvites
     * const { count } = await prisma.weddingInvite.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WeddingInviteDeleteManyArgs>(args?: SelectSubset<T, WeddingInviteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WeddingInvites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingInviteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WeddingInvites
     * const weddingInvite = await prisma.weddingInvite.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WeddingInviteUpdateManyArgs>(args: SelectSubset<T, WeddingInviteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WeddingInvites and returns the data updated in the database.
     * @param {WeddingInviteUpdateManyAndReturnArgs} args - Arguments to update many WeddingInvites.
     * @example
     * // Update many WeddingInvites
     * const weddingInvite = await prisma.weddingInvite.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WeddingInvites and only return the `id`
     * const weddingInviteWithIdOnly = await prisma.weddingInvite.updateManyAndReturn({
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
    updateManyAndReturn<T extends WeddingInviteUpdateManyAndReturnArgs>(args: SelectSubset<T, WeddingInviteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeddingInvitePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WeddingInvite.
     * @param {WeddingInviteUpsertArgs} args - Arguments to update or create a WeddingInvite.
     * @example
     * // Update or create a WeddingInvite
     * const weddingInvite = await prisma.weddingInvite.upsert({
     *   create: {
     *     // ... data to create a WeddingInvite
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WeddingInvite we want to update
     *   }
     * })
     */
    upsert<T extends WeddingInviteUpsertArgs>(args: SelectSubset<T, WeddingInviteUpsertArgs<ExtArgs>>): Prisma__WeddingInviteClient<$Result.GetResult<Prisma.$WeddingInvitePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WeddingInvites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingInviteCountArgs} args - Arguments to filter WeddingInvites to count.
     * @example
     * // Count the number of WeddingInvites
     * const count = await prisma.weddingInvite.count({
     *   where: {
     *     // ... the filter for the WeddingInvites we want to count
     *   }
     * })
    **/
    count<T extends WeddingInviteCountArgs>(
      args?: Subset<T, WeddingInviteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WeddingInviteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WeddingInvite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingInviteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends WeddingInviteAggregateArgs>(args: Subset<T, WeddingInviteAggregateArgs>): Prisma.PrismaPromise<GetWeddingInviteAggregateType<T>>

    /**
     * Group by WeddingInvite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeddingInviteGroupByArgs} args - Group by arguments.
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
      T extends WeddingInviteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WeddingInviteGroupByArgs['orderBy'] }
        : { orderBy?: WeddingInviteGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, WeddingInviteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWeddingInviteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WeddingInvite model
   */
  readonly fields: WeddingInviteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WeddingInvite.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WeddingInviteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wedding<T extends WeddingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WeddingDefaultArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the WeddingInvite model
   */
  interface WeddingInviteFieldRefs {
    readonly id: FieldRef<"WeddingInvite", 'String'>
    readonly weddingId: FieldRef<"WeddingInvite", 'String'>
    readonly token: FieldRef<"WeddingInvite", 'String'>
    readonly expiresAt: FieldRef<"WeddingInvite", 'DateTime'>
    readonly acceptedAt: FieldRef<"WeddingInvite", 'DateTime'>
    readonly acceptedBy: FieldRef<"WeddingInvite", 'String'>
    readonly createdAt: FieldRef<"WeddingInvite", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WeddingInvite findUnique
   */
  export type WeddingInviteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvite
     */
    select?: WeddingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvite
     */
    omit?: WeddingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInviteInclude<ExtArgs> | null
    /**
     * Filter, which WeddingInvite to fetch.
     */
    where: WeddingInviteWhereUniqueInput
  }

  /**
   * WeddingInvite findUniqueOrThrow
   */
  export type WeddingInviteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvite
     */
    select?: WeddingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvite
     */
    omit?: WeddingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInviteInclude<ExtArgs> | null
    /**
     * Filter, which WeddingInvite to fetch.
     */
    where: WeddingInviteWhereUniqueInput
  }

  /**
   * WeddingInvite findFirst
   */
  export type WeddingInviteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvite
     */
    select?: WeddingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvite
     */
    omit?: WeddingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInviteInclude<ExtArgs> | null
    /**
     * Filter, which WeddingInvite to fetch.
     */
    where?: WeddingInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeddingInvites to fetch.
     */
    orderBy?: WeddingInviteOrderByWithRelationInput | WeddingInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WeddingInvites.
     */
    cursor?: WeddingInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeddingInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeddingInvites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WeddingInvites.
     */
    distinct?: WeddingInviteScalarFieldEnum | WeddingInviteScalarFieldEnum[]
  }

  /**
   * WeddingInvite findFirstOrThrow
   */
  export type WeddingInviteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvite
     */
    select?: WeddingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvite
     */
    omit?: WeddingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInviteInclude<ExtArgs> | null
    /**
     * Filter, which WeddingInvite to fetch.
     */
    where?: WeddingInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeddingInvites to fetch.
     */
    orderBy?: WeddingInviteOrderByWithRelationInput | WeddingInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WeddingInvites.
     */
    cursor?: WeddingInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeddingInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeddingInvites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WeddingInvites.
     */
    distinct?: WeddingInviteScalarFieldEnum | WeddingInviteScalarFieldEnum[]
  }

  /**
   * WeddingInvite findMany
   */
  export type WeddingInviteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvite
     */
    select?: WeddingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvite
     */
    omit?: WeddingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInviteInclude<ExtArgs> | null
    /**
     * Filter, which WeddingInvites to fetch.
     */
    where?: WeddingInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeddingInvites to fetch.
     */
    orderBy?: WeddingInviteOrderByWithRelationInput | WeddingInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WeddingInvites.
     */
    cursor?: WeddingInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeddingInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeddingInvites.
     */
    skip?: number
    distinct?: WeddingInviteScalarFieldEnum | WeddingInviteScalarFieldEnum[]
  }

  /**
   * WeddingInvite create
   */
  export type WeddingInviteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvite
     */
    select?: WeddingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvite
     */
    omit?: WeddingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInviteInclude<ExtArgs> | null
    /**
     * The data needed to create a WeddingInvite.
     */
    data: XOR<WeddingInviteCreateInput, WeddingInviteUncheckedCreateInput>
  }

  /**
   * WeddingInvite createMany
   */
  export type WeddingInviteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WeddingInvites.
     */
    data: WeddingInviteCreateManyInput | WeddingInviteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WeddingInvite createManyAndReturn
   */
  export type WeddingInviteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvite
     */
    select?: WeddingInviteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvite
     */
    omit?: WeddingInviteOmit<ExtArgs> | null
    /**
     * The data used to create many WeddingInvites.
     */
    data: WeddingInviteCreateManyInput | WeddingInviteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInviteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WeddingInvite update
   */
  export type WeddingInviteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvite
     */
    select?: WeddingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvite
     */
    omit?: WeddingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInviteInclude<ExtArgs> | null
    /**
     * The data needed to update a WeddingInvite.
     */
    data: XOR<WeddingInviteUpdateInput, WeddingInviteUncheckedUpdateInput>
    /**
     * Choose, which WeddingInvite to update.
     */
    where: WeddingInviteWhereUniqueInput
  }

  /**
   * WeddingInvite updateMany
   */
  export type WeddingInviteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WeddingInvites.
     */
    data: XOR<WeddingInviteUpdateManyMutationInput, WeddingInviteUncheckedUpdateManyInput>
    /**
     * Filter which WeddingInvites to update
     */
    where?: WeddingInviteWhereInput
    /**
     * Limit how many WeddingInvites to update.
     */
    limit?: number
  }

  /**
   * WeddingInvite updateManyAndReturn
   */
  export type WeddingInviteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvite
     */
    select?: WeddingInviteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvite
     */
    omit?: WeddingInviteOmit<ExtArgs> | null
    /**
     * The data used to update WeddingInvites.
     */
    data: XOR<WeddingInviteUpdateManyMutationInput, WeddingInviteUncheckedUpdateManyInput>
    /**
     * Filter which WeddingInvites to update
     */
    where?: WeddingInviteWhereInput
    /**
     * Limit how many WeddingInvites to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInviteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WeddingInvite upsert
   */
  export type WeddingInviteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvite
     */
    select?: WeddingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvite
     */
    omit?: WeddingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInviteInclude<ExtArgs> | null
    /**
     * The filter to search for the WeddingInvite to update in case it exists.
     */
    where: WeddingInviteWhereUniqueInput
    /**
     * In case the WeddingInvite found by the `where` argument doesn't exist, create a new WeddingInvite with this data.
     */
    create: XOR<WeddingInviteCreateInput, WeddingInviteUncheckedCreateInput>
    /**
     * In case the WeddingInvite was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WeddingInviteUpdateInput, WeddingInviteUncheckedUpdateInput>
  }

  /**
   * WeddingInvite delete
   */
  export type WeddingInviteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvite
     */
    select?: WeddingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvite
     */
    omit?: WeddingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInviteInclude<ExtArgs> | null
    /**
     * Filter which WeddingInvite to delete.
     */
    where: WeddingInviteWhereUniqueInput
  }

  /**
   * WeddingInvite deleteMany
   */
  export type WeddingInviteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WeddingInvites to delete
     */
    where?: WeddingInviteWhereInput
    /**
     * Limit how many WeddingInvites to delete.
     */
    limit?: number
  }

  /**
   * WeddingInvite without action
   */
  export type WeddingInviteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeddingInvite
     */
    select?: WeddingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeddingInvite
     */
    omit?: WeddingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeddingInviteInclude<ExtArgs> | null
  }


  /**
   * Model Task
   */

  export type AggregateTask = {
    _count: TaskCountAggregateOutputType | null
    _avg: TaskAvgAggregateOutputType | null
    _sum: TaskSumAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  export type TaskAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type TaskSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type TaskMinAggregateOutputType = {
    id: string | null
    weddingId: string | null
    title: string | null
    categorySlug: string | null
    status: $Enums.TaskStatus | null
    dueDate: Date | null
    dueRemindedAt: Date | null
    sortOrder: number | null
    isCustom: boolean | null
    assignee: string | null
  }

  export type TaskMaxAggregateOutputType = {
    id: string | null
    weddingId: string | null
    title: string | null
    categorySlug: string | null
    status: $Enums.TaskStatus | null
    dueDate: Date | null
    dueRemindedAt: Date | null
    sortOrder: number | null
    isCustom: boolean | null
    assignee: string | null
  }

  export type TaskCountAggregateOutputType = {
    id: number
    weddingId: number
    title: number
    categorySlug: number
    status: number
    dueDate: number
    dueRemindedAt: number
    sortOrder: number
    isCustom: number
    assignee: number
    _all: number
  }


  export type TaskAvgAggregateInputType = {
    sortOrder?: true
  }

  export type TaskSumAggregateInputType = {
    sortOrder?: true
  }

  export type TaskMinAggregateInputType = {
    id?: true
    weddingId?: true
    title?: true
    categorySlug?: true
    status?: true
    dueDate?: true
    dueRemindedAt?: true
    sortOrder?: true
    isCustom?: true
    assignee?: true
  }

  export type TaskMaxAggregateInputType = {
    id?: true
    weddingId?: true
    title?: true
    categorySlug?: true
    status?: true
    dueDate?: true
    dueRemindedAt?: true
    sortOrder?: true
    isCustom?: true
    assignee?: true
  }

  export type TaskCountAggregateInputType = {
    id?: true
    weddingId?: true
    title?: true
    categorySlug?: true
    status?: true
    dueDate?: true
    dueRemindedAt?: true
    sortOrder?: true
    isCustom?: true
    assignee?: true
    _all?: true
  }

  export type TaskAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Task to aggregate.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tasks
    **/
    _count?: true | TaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TaskAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TaskSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskMaxAggregateInputType
  }

  export type GetTaskAggregateType<T extends TaskAggregateArgs> = {
        [P in keyof T & keyof AggregateTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTask[P]>
      : GetScalarType<T[P], AggregateTask[P]>
  }




  export type TaskGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithAggregationInput | TaskOrderByWithAggregationInput[]
    by: TaskScalarFieldEnum[] | TaskScalarFieldEnum
    having?: TaskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskCountAggregateInputType | true
    _avg?: TaskAvgAggregateInputType
    _sum?: TaskSumAggregateInputType
    _min?: TaskMinAggregateInputType
    _max?: TaskMaxAggregateInputType
  }

  export type TaskGroupByOutputType = {
    id: string
    weddingId: string
    title: string
    categorySlug: string | null
    status: $Enums.TaskStatus
    dueDate: Date | null
    dueRemindedAt: Date | null
    sortOrder: number
    isCustom: boolean
    assignee: string | null
    _count: TaskCountAggregateOutputType | null
    _avg: TaskAvgAggregateOutputType | null
    _sum: TaskSumAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  type GetTaskGroupByPayload<T extends TaskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskGroupByOutputType[P]>
            : GetScalarType<T[P], TaskGroupByOutputType[P]>
        }
      >
    >


  export type TaskSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    title?: boolean
    categorySlug?: boolean
    status?: boolean
    dueDate?: boolean
    dueRemindedAt?: boolean
    sortOrder?: boolean
    isCustom?: boolean
    assignee?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    title?: boolean
    categorySlug?: boolean
    status?: boolean
    dueDate?: boolean
    dueRemindedAt?: boolean
    sortOrder?: boolean
    isCustom?: boolean
    assignee?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    title?: boolean
    categorySlug?: boolean
    status?: boolean
    dueDate?: boolean
    dueRemindedAt?: boolean
    sortOrder?: boolean
    isCustom?: boolean
    assignee?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectScalar = {
    id?: boolean
    weddingId?: boolean
    title?: boolean
    categorySlug?: boolean
    status?: boolean
    dueDate?: boolean
    dueRemindedAt?: boolean
    sortOrder?: boolean
    isCustom?: boolean
    assignee?: boolean
  }

  export type TaskOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "weddingId" | "title" | "categorySlug" | "status" | "dueDate" | "dueRemindedAt" | "sortOrder" | "isCustom" | "assignee", ExtArgs["result"]["task"]>
  export type TaskInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }
  export type TaskIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }
  export type TaskIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }

  export type $TaskPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Task"
    objects: {
      wedding: Prisma.$WeddingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      weddingId: string
      title: string
      categorySlug: string | null
      status: $Enums.TaskStatus
      dueDate: Date | null
      dueRemindedAt: Date | null
      sortOrder: number
      isCustom: boolean
      assignee: string | null
    }, ExtArgs["result"]["task"]>
    composites: {}
  }

  type TaskGetPayload<S extends boolean | null | undefined | TaskDefaultArgs> = $Result.GetResult<Prisma.$TaskPayload, S>

  type TaskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TaskFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TaskCountAggregateInputType | true
    }

  export interface TaskDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Task'], meta: { name: 'Task' } }
    /**
     * Find zero or one Task that matches the filter.
     * @param {TaskFindUniqueArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskFindUniqueArgs>(args: SelectSubset<T, TaskFindUniqueArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Task that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TaskFindUniqueOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Task that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskFindFirstArgs>(args?: SelectSubset<T, TaskFindFirstArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Task that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tasks
     * const tasks = await prisma.task.findMany()
     * 
     * // Get first 10 Tasks
     * const tasks = await prisma.task.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskWithIdOnly = await prisma.task.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskFindManyArgs>(args?: SelectSubset<T, TaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Task.
     * @param {TaskCreateArgs} args - Arguments to create a Task.
     * @example
     * // Create one Task
     * const Task = await prisma.task.create({
     *   data: {
     *     // ... data to create a Task
     *   }
     * })
     * 
     */
    create<T extends TaskCreateArgs>(args: SelectSubset<T, TaskCreateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tasks.
     * @param {TaskCreateManyArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskCreateManyArgs>(args?: SelectSubset<T, TaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tasks and returns the data saved in the database.
     * @param {TaskCreateManyAndReturnArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tasks and only return the `id`
     * const taskWithIdOnly = await prisma.task.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Task.
     * @param {TaskDeleteArgs} args - Arguments to delete one Task.
     * @example
     * // Delete one Task
     * const Task = await prisma.task.delete({
     *   where: {
     *     // ... filter to delete one Task
     *   }
     * })
     * 
     */
    delete<T extends TaskDeleteArgs>(args: SelectSubset<T, TaskDeleteArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Task.
     * @param {TaskUpdateArgs} args - Arguments to update one Task.
     * @example
     * // Update one Task
     * const task = await prisma.task.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskUpdateArgs>(args: SelectSubset<T, TaskUpdateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tasks.
     * @param {TaskDeleteManyArgs} args - Arguments to filter Tasks to delete.
     * @example
     * // Delete a few Tasks
     * const { count } = await prisma.task.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskDeleteManyArgs>(args?: SelectSubset<T, TaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskUpdateManyArgs>(args: SelectSubset<T, TaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks and returns the data updated in the database.
     * @param {TaskUpdateManyAndReturnArgs} args - Arguments to update many Tasks.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tasks and only return the `id`
     * const taskWithIdOnly = await prisma.task.updateManyAndReturn({
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
    updateManyAndReturn<T extends TaskUpdateManyAndReturnArgs>(args: SelectSubset<T, TaskUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Task.
     * @param {TaskUpsertArgs} args - Arguments to update or create a Task.
     * @example
     * // Update or create a Task
     * const task = await prisma.task.upsert({
     *   create: {
     *     // ... data to create a Task
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Task we want to update
     *   }
     * })
     */
    upsert<T extends TaskUpsertArgs>(args: SelectSubset<T, TaskUpsertArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCountArgs} args - Arguments to filter Tasks to count.
     * @example
     * // Count the number of Tasks
     * const count = await prisma.task.count({
     *   where: {
     *     // ... the filter for the Tasks we want to count
     *   }
     * })
    **/
    count<T extends TaskCountArgs>(
      args?: Subset<T, TaskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TaskAggregateArgs>(args: Subset<T, TaskAggregateArgs>): Prisma.PrismaPromise<GetTaskAggregateType<T>>

    /**
     * Group by Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskGroupByArgs} args - Group by arguments.
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
      T extends TaskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskGroupByArgs['orderBy'] }
        : { orderBy?: TaskGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Task model
   */
  readonly fields: TaskFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Task.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wedding<T extends WeddingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WeddingDefaultArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Task model
   */
  interface TaskFieldRefs {
    readonly id: FieldRef<"Task", 'String'>
    readonly weddingId: FieldRef<"Task", 'String'>
    readonly title: FieldRef<"Task", 'String'>
    readonly categorySlug: FieldRef<"Task", 'String'>
    readonly status: FieldRef<"Task", 'TaskStatus'>
    readonly dueDate: FieldRef<"Task", 'DateTime'>
    readonly dueRemindedAt: FieldRef<"Task", 'DateTime'>
    readonly sortOrder: FieldRef<"Task", 'Int'>
    readonly isCustom: FieldRef<"Task", 'Boolean'>
    readonly assignee: FieldRef<"Task", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Task findUnique
   */
  export type TaskFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findUniqueOrThrow
   */
  export type TaskFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findFirst
   */
  export type TaskFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findFirstOrThrow
   */
  export type TaskFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findMany
   */
  export type TaskFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Tasks to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task create
   */
  export type TaskCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to create a Task.
     */
    data: XOR<TaskCreateInput, TaskUncheckedCreateInput>
  }

  /**
   * Task createMany
   */
  export type TaskCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Task createManyAndReturn
   */
  export type TaskCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Task update
   */
  export type TaskUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to update a Task.
     */
    data: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
    /**
     * Choose, which Task to update.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task updateMany
   */
  export type TaskUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tasks.
     */
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyInput>
    /**
     * Filter which Tasks to update
     */
    where?: TaskWhereInput
    /**
     * Limit how many Tasks to update.
     */
    limit?: number
  }

  /**
   * Task updateManyAndReturn
   */
  export type TaskUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * The data used to update Tasks.
     */
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyInput>
    /**
     * Filter which Tasks to update
     */
    where?: TaskWhereInput
    /**
     * Limit how many Tasks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Task upsert
   */
  export type TaskUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The filter to search for the Task to update in case it exists.
     */
    where: TaskWhereUniqueInput
    /**
     * In case the Task found by the `where` argument doesn't exist, create a new Task with this data.
     */
    create: XOR<TaskCreateInput, TaskUncheckedCreateInput>
    /**
     * In case the Task was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
  }

  /**
   * Task delete
   */
  export type TaskDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter which Task to delete.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task deleteMany
   */
  export type TaskDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tasks to delete
     */
    where?: TaskWhereInput
    /**
     * Limit how many Tasks to delete.
     */
    limit?: number
  }

  /**
   * Task without action
   */
  export type TaskDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
  }


  /**
   * Model Guest
   */

  export type AggregateGuest = {
    _count: GuestCountAggregateOutputType | null
    _min: GuestMinAggregateOutputType | null
    _max: GuestMaxAggregateOutputType | null
  }

  export type GuestMinAggregateOutputType = {
    id: string | null
    weddingId: string | null
    name: string | null
    email: string | null
    phone: string | null
    side: $Enums.GuestSide | null
    rsvpStatus: $Enums.RsvpStatus | null
    plusOne: boolean | null
    plusOneName: string | null
    plusOneAttending: boolean | null
    allergies: string | null
    tableLabel: string | null
    notes: string | null
    inviteToken: string | null
    respondedAt: Date | null
    createdAt: Date | null
  }

  export type GuestMaxAggregateOutputType = {
    id: string | null
    weddingId: string | null
    name: string | null
    email: string | null
    phone: string | null
    side: $Enums.GuestSide | null
    rsvpStatus: $Enums.RsvpStatus | null
    plusOne: boolean | null
    plusOneName: string | null
    plusOneAttending: boolean | null
    allergies: string | null
    tableLabel: string | null
    notes: string | null
    inviteToken: string | null
    respondedAt: Date | null
    createdAt: Date | null
  }

  export type GuestCountAggregateOutputType = {
    id: number
    weddingId: number
    name: number
    email: number
    phone: number
    side: number
    rsvpStatus: number
    plusOne: number
    plusOneName: number
    plusOneAttending: number
    allergies: number
    tableLabel: number
    notes: number
    inviteToken: number
    respondedAt: number
    createdAt: number
    _all: number
  }


  export type GuestMinAggregateInputType = {
    id?: true
    weddingId?: true
    name?: true
    email?: true
    phone?: true
    side?: true
    rsvpStatus?: true
    plusOne?: true
    plusOneName?: true
    plusOneAttending?: true
    allergies?: true
    tableLabel?: true
    notes?: true
    inviteToken?: true
    respondedAt?: true
    createdAt?: true
  }

  export type GuestMaxAggregateInputType = {
    id?: true
    weddingId?: true
    name?: true
    email?: true
    phone?: true
    side?: true
    rsvpStatus?: true
    plusOne?: true
    plusOneName?: true
    plusOneAttending?: true
    allergies?: true
    tableLabel?: true
    notes?: true
    inviteToken?: true
    respondedAt?: true
    createdAt?: true
  }

  export type GuestCountAggregateInputType = {
    id?: true
    weddingId?: true
    name?: true
    email?: true
    phone?: true
    side?: true
    rsvpStatus?: true
    plusOne?: true
    plusOneName?: true
    plusOneAttending?: true
    allergies?: true
    tableLabel?: true
    notes?: true
    inviteToken?: true
    respondedAt?: true
    createdAt?: true
    _all?: true
  }

  export type GuestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Guest to aggregate.
     */
    where?: GuestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guests to fetch.
     */
    orderBy?: GuestOrderByWithRelationInput | GuestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GuestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Guests
    **/
    _count?: true | GuestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GuestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GuestMaxAggregateInputType
  }

  export type GetGuestAggregateType<T extends GuestAggregateArgs> = {
        [P in keyof T & keyof AggregateGuest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGuest[P]>
      : GetScalarType<T[P], AggregateGuest[P]>
  }




  export type GuestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuestWhereInput
    orderBy?: GuestOrderByWithAggregationInput | GuestOrderByWithAggregationInput[]
    by: GuestScalarFieldEnum[] | GuestScalarFieldEnum
    having?: GuestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GuestCountAggregateInputType | true
    _min?: GuestMinAggregateInputType
    _max?: GuestMaxAggregateInputType
  }

  export type GuestGroupByOutputType = {
    id: string
    weddingId: string
    name: string
    email: string | null
    phone: string | null
    side: $Enums.GuestSide
    rsvpStatus: $Enums.RsvpStatus
    plusOne: boolean
    plusOneName: string | null
    plusOneAttending: boolean | null
    allergies: string | null
    tableLabel: string | null
    notes: string | null
    inviteToken: string
    respondedAt: Date | null
    createdAt: Date
    _count: GuestCountAggregateOutputType | null
    _min: GuestMinAggregateOutputType | null
    _max: GuestMaxAggregateOutputType | null
  }

  type GetGuestGroupByPayload<T extends GuestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GuestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GuestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GuestGroupByOutputType[P]>
            : GetScalarType<T[P], GuestGroupByOutputType[P]>
        }
      >
    >


  export type GuestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    side?: boolean
    rsvpStatus?: boolean
    plusOne?: boolean
    plusOneName?: boolean
    plusOneAttending?: boolean
    allergies?: boolean
    tableLabel?: boolean
    notes?: boolean
    inviteToken?: boolean
    respondedAt?: boolean
    createdAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guest"]>

  export type GuestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    side?: boolean
    rsvpStatus?: boolean
    plusOne?: boolean
    plusOneName?: boolean
    plusOneAttending?: boolean
    allergies?: boolean
    tableLabel?: boolean
    notes?: boolean
    inviteToken?: boolean
    respondedAt?: boolean
    createdAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guest"]>

  export type GuestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    side?: boolean
    rsvpStatus?: boolean
    plusOne?: boolean
    plusOneName?: boolean
    plusOneAttending?: boolean
    allergies?: boolean
    tableLabel?: boolean
    notes?: boolean
    inviteToken?: boolean
    respondedAt?: boolean
    createdAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guest"]>

  export type GuestSelectScalar = {
    id?: boolean
    weddingId?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    side?: boolean
    rsvpStatus?: boolean
    plusOne?: boolean
    plusOneName?: boolean
    plusOneAttending?: boolean
    allergies?: boolean
    tableLabel?: boolean
    notes?: boolean
    inviteToken?: boolean
    respondedAt?: boolean
    createdAt?: boolean
  }

  export type GuestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "weddingId" | "name" | "email" | "phone" | "side" | "rsvpStatus" | "plusOne" | "plusOneName" | "plusOneAttending" | "allergies" | "tableLabel" | "notes" | "inviteToken" | "respondedAt" | "createdAt", ExtArgs["result"]["guest"]>
  export type GuestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }
  export type GuestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }
  export type GuestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
  }

  export type $GuestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Guest"
    objects: {
      wedding: Prisma.$WeddingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      weddingId: string
      name: string
      email: string | null
      phone: string | null
      side: $Enums.GuestSide
      rsvpStatus: $Enums.RsvpStatus
      plusOne: boolean
      plusOneName: string | null
      plusOneAttending: boolean | null
      allergies: string | null
      tableLabel: string | null
      notes: string | null
      inviteToken: string
      respondedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["guest"]>
    composites: {}
  }

  type GuestGetPayload<S extends boolean | null | undefined | GuestDefaultArgs> = $Result.GetResult<Prisma.$GuestPayload, S>

  type GuestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GuestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GuestCountAggregateInputType | true
    }

  export interface GuestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Guest'], meta: { name: 'Guest' } }
    /**
     * Find zero or one Guest that matches the filter.
     * @param {GuestFindUniqueArgs} args - Arguments to find a Guest
     * @example
     * // Get one Guest
     * const guest = await prisma.guest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GuestFindUniqueArgs>(args: SelectSubset<T, GuestFindUniqueArgs<ExtArgs>>): Prisma__GuestClient<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Guest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GuestFindUniqueOrThrowArgs} args - Arguments to find a Guest
     * @example
     * // Get one Guest
     * const guest = await prisma.guest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GuestFindUniqueOrThrowArgs>(args: SelectSubset<T, GuestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GuestClient<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Guest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestFindFirstArgs} args - Arguments to find a Guest
     * @example
     * // Get one Guest
     * const guest = await prisma.guest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GuestFindFirstArgs>(args?: SelectSubset<T, GuestFindFirstArgs<ExtArgs>>): Prisma__GuestClient<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Guest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestFindFirstOrThrowArgs} args - Arguments to find a Guest
     * @example
     * // Get one Guest
     * const guest = await prisma.guest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GuestFindFirstOrThrowArgs>(args?: SelectSubset<T, GuestFindFirstOrThrowArgs<ExtArgs>>): Prisma__GuestClient<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Guests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Guests
     * const guests = await prisma.guest.findMany()
     * 
     * // Get first 10 Guests
     * const guests = await prisma.guest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const guestWithIdOnly = await prisma.guest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GuestFindManyArgs>(args?: SelectSubset<T, GuestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Guest.
     * @param {GuestCreateArgs} args - Arguments to create a Guest.
     * @example
     * // Create one Guest
     * const Guest = await prisma.guest.create({
     *   data: {
     *     // ... data to create a Guest
     *   }
     * })
     * 
     */
    create<T extends GuestCreateArgs>(args: SelectSubset<T, GuestCreateArgs<ExtArgs>>): Prisma__GuestClient<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Guests.
     * @param {GuestCreateManyArgs} args - Arguments to create many Guests.
     * @example
     * // Create many Guests
     * const guest = await prisma.guest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GuestCreateManyArgs>(args?: SelectSubset<T, GuestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Guests and returns the data saved in the database.
     * @param {GuestCreateManyAndReturnArgs} args - Arguments to create many Guests.
     * @example
     * // Create many Guests
     * const guest = await prisma.guest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Guests and only return the `id`
     * const guestWithIdOnly = await prisma.guest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GuestCreateManyAndReturnArgs>(args?: SelectSubset<T, GuestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Guest.
     * @param {GuestDeleteArgs} args - Arguments to delete one Guest.
     * @example
     * // Delete one Guest
     * const Guest = await prisma.guest.delete({
     *   where: {
     *     // ... filter to delete one Guest
     *   }
     * })
     * 
     */
    delete<T extends GuestDeleteArgs>(args: SelectSubset<T, GuestDeleteArgs<ExtArgs>>): Prisma__GuestClient<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Guest.
     * @param {GuestUpdateArgs} args - Arguments to update one Guest.
     * @example
     * // Update one Guest
     * const guest = await prisma.guest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GuestUpdateArgs>(args: SelectSubset<T, GuestUpdateArgs<ExtArgs>>): Prisma__GuestClient<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Guests.
     * @param {GuestDeleteManyArgs} args - Arguments to filter Guests to delete.
     * @example
     * // Delete a few Guests
     * const { count } = await prisma.guest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GuestDeleteManyArgs>(args?: SelectSubset<T, GuestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Guests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Guests
     * const guest = await prisma.guest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GuestUpdateManyArgs>(args: SelectSubset<T, GuestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Guests and returns the data updated in the database.
     * @param {GuestUpdateManyAndReturnArgs} args - Arguments to update many Guests.
     * @example
     * // Update many Guests
     * const guest = await prisma.guest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Guests and only return the `id`
     * const guestWithIdOnly = await prisma.guest.updateManyAndReturn({
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
    updateManyAndReturn<T extends GuestUpdateManyAndReturnArgs>(args: SelectSubset<T, GuestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Guest.
     * @param {GuestUpsertArgs} args - Arguments to update or create a Guest.
     * @example
     * // Update or create a Guest
     * const guest = await prisma.guest.upsert({
     *   create: {
     *     // ... data to create a Guest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Guest we want to update
     *   }
     * })
     */
    upsert<T extends GuestUpsertArgs>(args: SelectSubset<T, GuestUpsertArgs<ExtArgs>>): Prisma__GuestClient<$Result.GetResult<Prisma.$GuestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Guests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestCountArgs} args - Arguments to filter Guests to count.
     * @example
     * // Count the number of Guests
     * const count = await prisma.guest.count({
     *   where: {
     *     // ... the filter for the Guests we want to count
     *   }
     * })
    **/
    count<T extends GuestCountArgs>(
      args?: Subset<T, GuestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GuestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Guest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GuestAggregateArgs>(args: Subset<T, GuestAggregateArgs>): Prisma.PrismaPromise<GetGuestAggregateType<T>>

    /**
     * Group by Guest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestGroupByArgs} args - Group by arguments.
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
      T extends GuestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GuestGroupByArgs['orderBy'] }
        : { orderBy?: GuestGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GuestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGuestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Guest model
   */
  readonly fields: GuestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Guest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GuestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wedding<T extends WeddingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WeddingDefaultArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Guest model
   */
  interface GuestFieldRefs {
    readonly id: FieldRef<"Guest", 'String'>
    readonly weddingId: FieldRef<"Guest", 'String'>
    readonly name: FieldRef<"Guest", 'String'>
    readonly email: FieldRef<"Guest", 'String'>
    readonly phone: FieldRef<"Guest", 'String'>
    readonly side: FieldRef<"Guest", 'GuestSide'>
    readonly rsvpStatus: FieldRef<"Guest", 'RsvpStatus'>
    readonly plusOne: FieldRef<"Guest", 'Boolean'>
    readonly plusOneName: FieldRef<"Guest", 'String'>
    readonly plusOneAttending: FieldRef<"Guest", 'Boolean'>
    readonly allergies: FieldRef<"Guest", 'String'>
    readonly tableLabel: FieldRef<"Guest", 'String'>
    readonly notes: FieldRef<"Guest", 'String'>
    readonly inviteToken: FieldRef<"Guest", 'String'>
    readonly respondedAt: FieldRef<"Guest", 'DateTime'>
    readonly createdAt: FieldRef<"Guest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Guest findUnique
   */
  export type GuestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guest
     */
    omit?: GuestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
    /**
     * Filter, which Guest to fetch.
     */
    where: GuestWhereUniqueInput
  }

  /**
   * Guest findUniqueOrThrow
   */
  export type GuestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guest
     */
    omit?: GuestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
    /**
     * Filter, which Guest to fetch.
     */
    where: GuestWhereUniqueInput
  }

  /**
   * Guest findFirst
   */
  export type GuestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guest
     */
    omit?: GuestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
    /**
     * Filter, which Guest to fetch.
     */
    where?: GuestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guests to fetch.
     */
    orderBy?: GuestOrderByWithRelationInput | GuestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Guests.
     */
    cursor?: GuestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Guests.
     */
    distinct?: GuestScalarFieldEnum | GuestScalarFieldEnum[]
  }

  /**
   * Guest findFirstOrThrow
   */
  export type GuestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guest
     */
    omit?: GuestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
    /**
     * Filter, which Guest to fetch.
     */
    where?: GuestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guests to fetch.
     */
    orderBy?: GuestOrderByWithRelationInput | GuestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Guests.
     */
    cursor?: GuestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Guests.
     */
    distinct?: GuestScalarFieldEnum | GuestScalarFieldEnum[]
  }

  /**
   * Guest findMany
   */
  export type GuestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guest
     */
    omit?: GuestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
    /**
     * Filter, which Guests to fetch.
     */
    where?: GuestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guests to fetch.
     */
    orderBy?: GuestOrderByWithRelationInput | GuestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Guests.
     */
    cursor?: GuestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guests.
     */
    skip?: number
    distinct?: GuestScalarFieldEnum | GuestScalarFieldEnum[]
  }

  /**
   * Guest create
   */
  export type GuestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guest
     */
    omit?: GuestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
    /**
     * The data needed to create a Guest.
     */
    data: XOR<GuestCreateInput, GuestUncheckedCreateInput>
  }

  /**
   * Guest createMany
   */
  export type GuestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Guests.
     */
    data: GuestCreateManyInput | GuestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Guest createManyAndReturn
   */
  export type GuestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Guest
     */
    omit?: GuestOmit<ExtArgs> | null
    /**
     * The data used to create many Guests.
     */
    data: GuestCreateManyInput | GuestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Guest update
   */
  export type GuestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guest
     */
    omit?: GuestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
    /**
     * The data needed to update a Guest.
     */
    data: XOR<GuestUpdateInput, GuestUncheckedUpdateInput>
    /**
     * Choose, which Guest to update.
     */
    where: GuestWhereUniqueInput
  }

  /**
   * Guest updateMany
   */
  export type GuestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Guests.
     */
    data: XOR<GuestUpdateManyMutationInput, GuestUncheckedUpdateManyInput>
    /**
     * Filter which Guests to update
     */
    where?: GuestWhereInput
    /**
     * Limit how many Guests to update.
     */
    limit?: number
  }

  /**
   * Guest updateManyAndReturn
   */
  export type GuestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Guest
     */
    omit?: GuestOmit<ExtArgs> | null
    /**
     * The data used to update Guests.
     */
    data: XOR<GuestUpdateManyMutationInput, GuestUncheckedUpdateManyInput>
    /**
     * Filter which Guests to update
     */
    where?: GuestWhereInput
    /**
     * Limit how many Guests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Guest upsert
   */
  export type GuestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guest
     */
    omit?: GuestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
    /**
     * The filter to search for the Guest to update in case it exists.
     */
    where: GuestWhereUniqueInput
    /**
     * In case the Guest found by the `where` argument doesn't exist, create a new Guest with this data.
     */
    create: XOR<GuestCreateInput, GuestUncheckedCreateInput>
    /**
     * In case the Guest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GuestUpdateInput, GuestUncheckedUpdateInput>
  }

  /**
   * Guest delete
   */
  export type GuestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guest
     */
    omit?: GuestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
    /**
     * Filter which Guest to delete.
     */
    where: GuestWhereUniqueInput
  }

  /**
   * Guest deleteMany
   */
  export type GuestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Guests to delete
     */
    where?: GuestWhereInput
    /**
     * Limit how many Guests to delete.
     */
    limit?: number
  }

  /**
   * Guest without action
   */
  export type GuestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guest
     */
    select?: GuestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guest
     */
    omit?: GuestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestInclude<ExtArgs> | null
  }


  /**
   * Model BudgetItem
   */

  export type AggregateBudgetItem = {
    _count: BudgetItemCountAggregateOutputType | null
    _avg: BudgetItemAvgAggregateOutputType | null
    _sum: BudgetItemSumAggregateOutputType | null
    _min: BudgetItemMinAggregateOutputType | null
    _max: BudgetItemMaxAggregateOutputType | null
  }

  export type BudgetItemAvgAggregateOutputType = {
    estimated: number | null
    actual: number | null
  }

  export type BudgetItemSumAggregateOutputType = {
    estimated: number | null
    actual: number | null
  }

  export type BudgetItemMinAggregateOutputType = {
    id: string | null
    weddingId: string | null
    category: string | null
    title: string | null
    estimated: number | null
    actual: number | null
    paid: boolean | null
    notes: string | null
    externalVendorId: string | null
    createdAt: Date | null
  }

  export type BudgetItemMaxAggregateOutputType = {
    id: string | null
    weddingId: string | null
    category: string | null
    title: string | null
    estimated: number | null
    actual: number | null
    paid: boolean | null
    notes: string | null
    externalVendorId: string | null
    createdAt: Date | null
  }

  export type BudgetItemCountAggregateOutputType = {
    id: number
    weddingId: number
    category: number
    title: number
    estimated: number
    actual: number
    paid: number
    notes: number
    externalVendorId: number
    createdAt: number
    _all: number
  }


  export type BudgetItemAvgAggregateInputType = {
    estimated?: true
    actual?: true
  }

  export type BudgetItemSumAggregateInputType = {
    estimated?: true
    actual?: true
  }

  export type BudgetItemMinAggregateInputType = {
    id?: true
    weddingId?: true
    category?: true
    title?: true
    estimated?: true
    actual?: true
    paid?: true
    notes?: true
    externalVendorId?: true
    createdAt?: true
  }

  export type BudgetItemMaxAggregateInputType = {
    id?: true
    weddingId?: true
    category?: true
    title?: true
    estimated?: true
    actual?: true
    paid?: true
    notes?: true
    externalVendorId?: true
    createdAt?: true
  }

  export type BudgetItemCountAggregateInputType = {
    id?: true
    weddingId?: true
    category?: true
    title?: true
    estimated?: true
    actual?: true
    paid?: true
    notes?: true
    externalVendorId?: true
    createdAt?: true
    _all?: true
  }

  export type BudgetItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BudgetItem to aggregate.
     */
    where?: BudgetItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BudgetItems to fetch.
     */
    orderBy?: BudgetItemOrderByWithRelationInput | BudgetItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BudgetItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BudgetItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BudgetItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BudgetItems
    **/
    _count?: true | BudgetItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BudgetItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BudgetItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BudgetItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BudgetItemMaxAggregateInputType
  }

  export type GetBudgetItemAggregateType<T extends BudgetItemAggregateArgs> = {
        [P in keyof T & keyof AggregateBudgetItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBudgetItem[P]>
      : GetScalarType<T[P], AggregateBudgetItem[P]>
  }




  export type BudgetItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BudgetItemWhereInput
    orderBy?: BudgetItemOrderByWithAggregationInput | BudgetItemOrderByWithAggregationInput[]
    by: BudgetItemScalarFieldEnum[] | BudgetItemScalarFieldEnum
    having?: BudgetItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BudgetItemCountAggregateInputType | true
    _avg?: BudgetItemAvgAggregateInputType
    _sum?: BudgetItemSumAggregateInputType
    _min?: BudgetItemMinAggregateInputType
    _max?: BudgetItemMaxAggregateInputType
  }

  export type BudgetItemGroupByOutputType = {
    id: string
    weddingId: string
    category: string
    title: string
    estimated: number
    actual: number
    paid: boolean
    notes: string | null
    externalVendorId: string | null
    createdAt: Date
    _count: BudgetItemCountAggregateOutputType | null
    _avg: BudgetItemAvgAggregateOutputType | null
    _sum: BudgetItemSumAggregateOutputType | null
    _min: BudgetItemMinAggregateOutputType | null
    _max: BudgetItemMaxAggregateOutputType | null
  }

  type GetBudgetItemGroupByPayload<T extends BudgetItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BudgetItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BudgetItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BudgetItemGroupByOutputType[P]>
            : GetScalarType<T[P], BudgetItemGroupByOutputType[P]>
        }
      >
    >


  export type BudgetItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    category?: boolean
    title?: boolean
    estimated?: boolean
    actual?: boolean
    paid?: boolean
    notes?: boolean
    externalVendorId?: boolean
    createdAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
    externalVendor?: boolean | BudgetItem$externalVendorArgs<ExtArgs>
  }, ExtArgs["result"]["budgetItem"]>

  export type BudgetItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    category?: boolean
    title?: boolean
    estimated?: boolean
    actual?: boolean
    paid?: boolean
    notes?: boolean
    externalVendorId?: boolean
    createdAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
    externalVendor?: boolean | BudgetItem$externalVendorArgs<ExtArgs>
  }, ExtArgs["result"]["budgetItem"]>

  export type BudgetItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weddingId?: boolean
    category?: boolean
    title?: boolean
    estimated?: boolean
    actual?: boolean
    paid?: boolean
    notes?: boolean
    externalVendorId?: boolean
    createdAt?: boolean
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
    externalVendor?: boolean | BudgetItem$externalVendorArgs<ExtArgs>
  }, ExtArgs["result"]["budgetItem"]>

  export type BudgetItemSelectScalar = {
    id?: boolean
    weddingId?: boolean
    category?: boolean
    title?: boolean
    estimated?: boolean
    actual?: boolean
    paid?: boolean
    notes?: boolean
    externalVendorId?: boolean
    createdAt?: boolean
  }

  export type BudgetItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "weddingId" | "category" | "title" | "estimated" | "actual" | "paid" | "notes" | "externalVendorId" | "createdAt", ExtArgs["result"]["budgetItem"]>
  export type BudgetItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
    externalVendor?: boolean | BudgetItem$externalVendorArgs<ExtArgs>
  }
  export type BudgetItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
    externalVendor?: boolean | BudgetItem$externalVendorArgs<ExtArgs>
  }
  export type BudgetItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wedding?: boolean | WeddingDefaultArgs<ExtArgs>
    externalVendor?: boolean | BudgetItem$externalVendorArgs<ExtArgs>
  }

  export type $BudgetItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BudgetItem"
    objects: {
      wedding: Prisma.$WeddingPayload<ExtArgs>
      externalVendor: Prisma.$ExternalVendorPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      weddingId: string
      category: string
      title: string
      estimated: number
      actual: number
      paid: boolean
      notes: string | null
      externalVendorId: string | null
      createdAt: Date
    }, ExtArgs["result"]["budgetItem"]>
    composites: {}
  }

  type BudgetItemGetPayload<S extends boolean | null | undefined | BudgetItemDefaultArgs> = $Result.GetResult<Prisma.$BudgetItemPayload, S>

  type BudgetItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BudgetItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BudgetItemCountAggregateInputType | true
    }

  export interface BudgetItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BudgetItem'], meta: { name: 'BudgetItem' } }
    /**
     * Find zero or one BudgetItem that matches the filter.
     * @param {BudgetItemFindUniqueArgs} args - Arguments to find a BudgetItem
     * @example
     * // Get one BudgetItem
     * const budgetItem = await prisma.budgetItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BudgetItemFindUniqueArgs>(args: SelectSubset<T, BudgetItemFindUniqueArgs<ExtArgs>>): Prisma__BudgetItemClient<$Result.GetResult<Prisma.$BudgetItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BudgetItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BudgetItemFindUniqueOrThrowArgs} args - Arguments to find a BudgetItem
     * @example
     * // Get one BudgetItem
     * const budgetItem = await prisma.budgetItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BudgetItemFindUniqueOrThrowArgs>(args: SelectSubset<T, BudgetItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BudgetItemClient<$Result.GetResult<Prisma.$BudgetItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BudgetItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetItemFindFirstArgs} args - Arguments to find a BudgetItem
     * @example
     * // Get one BudgetItem
     * const budgetItem = await prisma.budgetItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BudgetItemFindFirstArgs>(args?: SelectSubset<T, BudgetItemFindFirstArgs<ExtArgs>>): Prisma__BudgetItemClient<$Result.GetResult<Prisma.$BudgetItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BudgetItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetItemFindFirstOrThrowArgs} args - Arguments to find a BudgetItem
     * @example
     * // Get one BudgetItem
     * const budgetItem = await prisma.budgetItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BudgetItemFindFirstOrThrowArgs>(args?: SelectSubset<T, BudgetItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__BudgetItemClient<$Result.GetResult<Prisma.$BudgetItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BudgetItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BudgetItems
     * const budgetItems = await prisma.budgetItem.findMany()
     * 
     * // Get first 10 BudgetItems
     * const budgetItems = await prisma.budgetItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const budgetItemWithIdOnly = await prisma.budgetItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BudgetItemFindManyArgs>(args?: SelectSubset<T, BudgetItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BudgetItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BudgetItem.
     * @param {BudgetItemCreateArgs} args - Arguments to create a BudgetItem.
     * @example
     * // Create one BudgetItem
     * const BudgetItem = await prisma.budgetItem.create({
     *   data: {
     *     // ... data to create a BudgetItem
     *   }
     * })
     * 
     */
    create<T extends BudgetItemCreateArgs>(args: SelectSubset<T, BudgetItemCreateArgs<ExtArgs>>): Prisma__BudgetItemClient<$Result.GetResult<Prisma.$BudgetItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BudgetItems.
     * @param {BudgetItemCreateManyArgs} args - Arguments to create many BudgetItems.
     * @example
     * // Create many BudgetItems
     * const budgetItem = await prisma.budgetItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BudgetItemCreateManyArgs>(args?: SelectSubset<T, BudgetItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BudgetItems and returns the data saved in the database.
     * @param {BudgetItemCreateManyAndReturnArgs} args - Arguments to create many BudgetItems.
     * @example
     * // Create many BudgetItems
     * const budgetItem = await prisma.budgetItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BudgetItems and only return the `id`
     * const budgetItemWithIdOnly = await prisma.budgetItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BudgetItemCreateManyAndReturnArgs>(args?: SelectSubset<T, BudgetItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BudgetItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BudgetItem.
     * @param {BudgetItemDeleteArgs} args - Arguments to delete one BudgetItem.
     * @example
     * // Delete one BudgetItem
     * const BudgetItem = await prisma.budgetItem.delete({
     *   where: {
     *     // ... filter to delete one BudgetItem
     *   }
     * })
     * 
     */
    delete<T extends BudgetItemDeleteArgs>(args: SelectSubset<T, BudgetItemDeleteArgs<ExtArgs>>): Prisma__BudgetItemClient<$Result.GetResult<Prisma.$BudgetItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BudgetItem.
     * @param {BudgetItemUpdateArgs} args - Arguments to update one BudgetItem.
     * @example
     * // Update one BudgetItem
     * const budgetItem = await prisma.budgetItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BudgetItemUpdateArgs>(args: SelectSubset<T, BudgetItemUpdateArgs<ExtArgs>>): Prisma__BudgetItemClient<$Result.GetResult<Prisma.$BudgetItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BudgetItems.
     * @param {BudgetItemDeleteManyArgs} args - Arguments to filter BudgetItems to delete.
     * @example
     * // Delete a few BudgetItems
     * const { count } = await prisma.budgetItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BudgetItemDeleteManyArgs>(args?: SelectSubset<T, BudgetItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BudgetItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BudgetItems
     * const budgetItem = await prisma.budgetItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BudgetItemUpdateManyArgs>(args: SelectSubset<T, BudgetItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BudgetItems and returns the data updated in the database.
     * @param {BudgetItemUpdateManyAndReturnArgs} args - Arguments to update many BudgetItems.
     * @example
     * // Update many BudgetItems
     * const budgetItem = await prisma.budgetItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BudgetItems and only return the `id`
     * const budgetItemWithIdOnly = await prisma.budgetItem.updateManyAndReturn({
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
    updateManyAndReturn<T extends BudgetItemUpdateManyAndReturnArgs>(args: SelectSubset<T, BudgetItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BudgetItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BudgetItem.
     * @param {BudgetItemUpsertArgs} args - Arguments to update or create a BudgetItem.
     * @example
     * // Update or create a BudgetItem
     * const budgetItem = await prisma.budgetItem.upsert({
     *   create: {
     *     // ... data to create a BudgetItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BudgetItem we want to update
     *   }
     * })
     */
    upsert<T extends BudgetItemUpsertArgs>(args: SelectSubset<T, BudgetItemUpsertArgs<ExtArgs>>): Prisma__BudgetItemClient<$Result.GetResult<Prisma.$BudgetItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BudgetItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetItemCountArgs} args - Arguments to filter BudgetItems to count.
     * @example
     * // Count the number of BudgetItems
     * const count = await prisma.budgetItem.count({
     *   where: {
     *     // ... the filter for the BudgetItems we want to count
     *   }
     * })
    **/
    count<T extends BudgetItemCountArgs>(
      args?: Subset<T, BudgetItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BudgetItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BudgetItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BudgetItemAggregateArgs>(args: Subset<T, BudgetItemAggregateArgs>): Prisma.PrismaPromise<GetBudgetItemAggregateType<T>>

    /**
     * Group by BudgetItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetItemGroupByArgs} args - Group by arguments.
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
      T extends BudgetItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BudgetItemGroupByArgs['orderBy'] }
        : { orderBy?: BudgetItemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BudgetItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBudgetItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BudgetItem model
   */
  readonly fields: BudgetItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BudgetItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BudgetItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wedding<T extends WeddingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WeddingDefaultArgs<ExtArgs>>): Prisma__WeddingClient<$Result.GetResult<Prisma.$WeddingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    externalVendor<T extends BudgetItem$externalVendorArgs<ExtArgs> = {}>(args?: Subset<T, BudgetItem$externalVendorArgs<ExtArgs>>): Prisma__ExternalVendorClient<$Result.GetResult<Prisma.$ExternalVendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the BudgetItem model
   */
  interface BudgetItemFieldRefs {
    readonly id: FieldRef<"BudgetItem", 'String'>
    readonly weddingId: FieldRef<"BudgetItem", 'String'>
    readonly category: FieldRef<"BudgetItem", 'String'>
    readonly title: FieldRef<"BudgetItem", 'String'>
    readonly estimated: FieldRef<"BudgetItem", 'Int'>
    readonly actual: FieldRef<"BudgetItem", 'Int'>
    readonly paid: FieldRef<"BudgetItem", 'Boolean'>
    readonly notes: FieldRef<"BudgetItem", 'String'>
    readonly externalVendorId: FieldRef<"BudgetItem", 'String'>
    readonly createdAt: FieldRef<"BudgetItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BudgetItem findUnique
   */
  export type BudgetItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BudgetItem
     */
    select?: BudgetItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BudgetItem
     */
    omit?: BudgetItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetItemInclude<ExtArgs> | null
    /**
     * Filter, which BudgetItem to fetch.
     */
    where: BudgetItemWhereUniqueInput
  }

  /**
   * BudgetItem findUniqueOrThrow
   */
  export type BudgetItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BudgetItem
     */
    select?: BudgetItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BudgetItem
     */
    omit?: BudgetItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetItemInclude<ExtArgs> | null
    /**
     * Filter, which BudgetItem to fetch.
     */
    where: BudgetItemWhereUniqueInput
  }

  /**
   * BudgetItem findFirst
   */
  export type BudgetItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BudgetItem
     */
    select?: BudgetItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BudgetItem
     */
    omit?: BudgetItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetItemInclude<ExtArgs> | null
    /**
     * Filter, which BudgetItem to fetch.
     */
    where?: BudgetItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BudgetItems to fetch.
     */
    orderBy?: BudgetItemOrderByWithRelationInput | BudgetItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BudgetItems.
     */
    cursor?: BudgetItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BudgetItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BudgetItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BudgetItems.
     */
    distinct?: BudgetItemScalarFieldEnum | BudgetItemScalarFieldEnum[]
  }

  /**
   * BudgetItem findFirstOrThrow
   */
  export type BudgetItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BudgetItem
     */
    select?: BudgetItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BudgetItem
     */
    omit?: BudgetItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetItemInclude<ExtArgs> | null
    /**
     * Filter, which BudgetItem to fetch.
     */
    where?: BudgetItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BudgetItems to fetch.
     */
    orderBy?: BudgetItemOrderByWithRelationInput | BudgetItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BudgetItems.
     */
    cursor?: BudgetItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BudgetItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BudgetItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BudgetItems.
     */
    distinct?: BudgetItemScalarFieldEnum | BudgetItemScalarFieldEnum[]
  }

  /**
   * BudgetItem findMany
   */
  export type BudgetItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BudgetItem
     */
    select?: BudgetItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BudgetItem
     */
    omit?: BudgetItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetItemInclude<ExtArgs> | null
    /**
     * Filter, which BudgetItems to fetch.
     */
    where?: BudgetItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BudgetItems to fetch.
     */
    orderBy?: BudgetItemOrderByWithRelationInput | BudgetItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BudgetItems.
     */
    cursor?: BudgetItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BudgetItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BudgetItems.
     */
    skip?: number
    distinct?: BudgetItemScalarFieldEnum | BudgetItemScalarFieldEnum[]
  }

  /**
   * BudgetItem create
   */
  export type BudgetItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BudgetItem
     */
    select?: BudgetItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BudgetItem
     */
    omit?: BudgetItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetItemInclude<ExtArgs> | null
    /**
     * The data needed to create a BudgetItem.
     */
    data: XOR<BudgetItemCreateInput, BudgetItemUncheckedCreateInput>
  }

  /**
   * BudgetItem createMany
   */
  export type BudgetItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BudgetItems.
     */
    data: BudgetItemCreateManyInput | BudgetItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BudgetItem createManyAndReturn
   */
  export type BudgetItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BudgetItem
     */
    select?: BudgetItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BudgetItem
     */
    omit?: BudgetItemOmit<ExtArgs> | null
    /**
     * The data used to create many BudgetItems.
     */
    data: BudgetItemCreateManyInput | BudgetItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BudgetItem update
   */
  export type BudgetItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BudgetItem
     */
    select?: BudgetItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BudgetItem
     */
    omit?: BudgetItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetItemInclude<ExtArgs> | null
    /**
     * The data needed to update a BudgetItem.
     */
    data: XOR<BudgetItemUpdateInput, BudgetItemUncheckedUpdateInput>
    /**
     * Choose, which BudgetItem to update.
     */
    where: BudgetItemWhereUniqueInput
  }

  /**
   * BudgetItem updateMany
   */
  export type BudgetItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BudgetItems.
     */
    data: XOR<BudgetItemUpdateManyMutationInput, BudgetItemUncheckedUpdateManyInput>
    /**
     * Filter which BudgetItems to update
     */
    where?: BudgetItemWhereInput
    /**
     * Limit how many BudgetItems to update.
     */
    limit?: number
  }

  /**
   * BudgetItem updateManyAndReturn
   */
  export type BudgetItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BudgetItem
     */
    select?: BudgetItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BudgetItem
     */
    omit?: BudgetItemOmit<ExtArgs> | null
    /**
     * The data used to update BudgetItems.
     */
    data: XOR<BudgetItemUpdateManyMutationInput, BudgetItemUncheckedUpdateManyInput>
    /**
     * Filter which BudgetItems to update
     */
    where?: BudgetItemWhereInput
    /**
     * Limit how many BudgetItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BudgetItem upsert
   */
  export type BudgetItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BudgetItem
     */
    select?: BudgetItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BudgetItem
     */
    omit?: BudgetItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetItemInclude<ExtArgs> | null
    /**
     * The filter to search for the BudgetItem to update in case it exists.
     */
    where: BudgetItemWhereUniqueInput
    /**
     * In case the BudgetItem found by the `where` argument doesn't exist, create a new BudgetItem with this data.
     */
    create: XOR<BudgetItemCreateInput, BudgetItemUncheckedCreateInput>
    /**
     * In case the BudgetItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BudgetItemUpdateInput, BudgetItemUncheckedUpdateInput>
  }

  /**
   * BudgetItem delete
   */
  export type BudgetItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BudgetItem
     */
    select?: BudgetItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BudgetItem
     */
    omit?: BudgetItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetItemInclude<ExtArgs> | null
    /**
     * Filter which BudgetItem to delete.
     */
    where: BudgetItemWhereUniqueInput
  }

  /**
   * BudgetItem deleteMany
   */
  export type BudgetItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BudgetItems to delete
     */
    where?: BudgetItemWhereInput
    /**
     * Limit how many BudgetItems to delete.
     */
    limit?: number
  }

  /**
   * BudgetItem.externalVendor
   */
  export type BudgetItem$externalVendorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExternalVendor
     */
    select?: ExternalVendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExternalVendor
     */
    omit?: ExternalVendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExternalVendorInclude<ExtArgs> | null
    where?: ExternalVendorWhereInput
  }

  /**
   * BudgetItem without action
   */
  export type BudgetItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BudgetItem
     */
    select?: BudgetItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BudgetItem
     */
    omit?: BudgetItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetItemInclude<ExtArgs> | null
  }


  /**
   * Model ContentTopic
   */

  export type AggregateContentTopic = {
    _count: ContentTopicCountAggregateOutputType | null
    _avg: ContentTopicAvgAggregateOutputType | null
    _sum: ContentTopicSumAggregateOutputType | null
    _min: ContentTopicMinAggregateOutputType | null
    _max: ContentTopicMaxAggregateOutputType | null
  }

  export type ContentTopicAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type ContentTopicSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type ContentTopicMinAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    description: string | null
    icon: string | null
    coverUrl: string | null
    sortOrder: number | null
  }

  export type ContentTopicMaxAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    description: string | null
    icon: string | null
    coverUrl: string | null
    sortOrder: number | null
  }

  export type ContentTopicCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    description: number
    icon: number
    coverUrl: number
    sortOrder: number
    _all: number
  }


  export type ContentTopicAvgAggregateInputType = {
    sortOrder?: true
  }

  export type ContentTopicSumAggregateInputType = {
    sortOrder?: true
  }

  export type ContentTopicMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    icon?: true
    coverUrl?: true
    sortOrder?: true
  }

  export type ContentTopicMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    icon?: true
    coverUrl?: true
    sortOrder?: true
  }

  export type ContentTopicCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    icon?: true
    coverUrl?: true
    sortOrder?: true
    _all?: true
  }

  export type ContentTopicAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContentTopic to aggregate.
     */
    where?: ContentTopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentTopics to fetch.
     */
    orderBy?: ContentTopicOrderByWithRelationInput | ContentTopicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContentTopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentTopics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentTopics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ContentTopics
    **/
    _count?: true | ContentTopicCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ContentTopicAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ContentTopicSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContentTopicMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContentTopicMaxAggregateInputType
  }

  export type GetContentTopicAggregateType<T extends ContentTopicAggregateArgs> = {
        [P in keyof T & keyof AggregateContentTopic]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContentTopic[P]>
      : GetScalarType<T[P], AggregateContentTopic[P]>
  }




  export type ContentTopicGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContentTopicWhereInput
    orderBy?: ContentTopicOrderByWithAggregationInput | ContentTopicOrderByWithAggregationInput[]
    by: ContentTopicScalarFieldEnum[] | ContentTopicScalarFieldEnum
    having?: ContentTopicScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContentTopicCountAggregateInputType | true
    _avg?: ContentTopicAvgAggregateInputType
    _sum?: ContentTopicSumAggregateInputType
    _min?: ContentTopicMinAggregateInputType
    _max?: ContentTopicMaxAggregateInputType
  }

  export type ContentTopicGroupByOutputType = {
    id: string
    name: string
    slug: string
    description: string
    icon: string
    coverUrl: string | null
    sortOrder: number
    _count: ContentTopicCountAggregateOutputType | null
    _avg: ContentTopicAvgAggregateOutputType | null
    _sum: ContentTopicSumAggregateOutputType | null
    _min: ContentTopicMinAggregateOutputType | null
    _max: ContentTopicMaxAggregateOutputType | null
  }

  type GetContentTopicGroupByPayload<T extends ContentTopicGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContentTopicGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContentTopicGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContentTopicGroupByOutputType[P]>
            : GetScalarType<T[P], ContentTopicGroupByOutputType[P]>
        }
      >
    >


  export type ContentTopicSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    icon?: boolean
    coverUrl?: boolean
    sortOrder?: boolean
    posts?: boolean | ContentTopic$postsArgs<ExtArgs>
    _count?: boolean | ContentTopicCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contentTopic"]>

  export type ContentTopicSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    icon?: boolean
    coverUrl?: boolean
    sortOrder?: boolean
  }, ExtArgs["result"]["contentTopic"]>

  export type ContentTopicSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    icon?: boolean
    coverUrl?: boolean
    sortOrder?: boolean
  }, ExtArgs["result"]["contentTopic"]>

  export type ContentTopicSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    icon?: boolean
    coverUrl?: boolean
    sortOrder?: boolean
  }

  export type ContentTopicOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "description" | "icon" | "coverUrl" | "sortOrder", ExtArgs["result"]["contentTopic"]>
  export type ContentTopicInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    posts?: boolean | ContentTopic$postsArgs<ExtArgs>
    _count?: boolean | ContentTopicCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ContentTopicIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ContentTopicIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ContentTopicPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ContentTopic"
    objects: {
      posts: Prisma.$ContentPostPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      slug: string
      description: string
      icon: string
      coverUrl: string | null
      sortOrder: number
    }, ExtArgs["result"]["contentTopic"]>
    composites: {}
  }

  type ContentTopicGetPayload<S extends boolean | null | undefined | ContentTopicDefaultArgs> = $Result.GetResult<Prisma.$ContentTopicPayload, S>

  type ContentTopicCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ContentTopicFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ContentTopicCountAggregateInputType | true
    }

  export interface ContentTopicDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ContentTopic'], meta: { name: 'ContentTopic' } }
    /**
     * Find zero or one ContentTopic that matches the filter.
     * @param {ContentTopicFindUniqueArgs} args - Arguments to find a ContentTopic
     * @example
     * // Get one ContentTopic
     * const contentTopic = await prisma.contentTopic.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContentTopicFindUniqueArgs>(args: SelectSubset<T, ContentTopicFindUniqueArgs<ExtArgs>>): Prisma__ContentTopicClient<$Result.GetResult<Prisma.$ContentTopicPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ContentTopic that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ContentTopicFindUniqueOrThrowArgs} args - Arguments to find a ContentTopic
     * @example
     * // Get one ContentTopic
     * const contentTopic = await prisma.contentTopic.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContentTopicFindUniqueOrThrowArgs>(args: SelectSubset<T, ContentTopicFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContentTopicClient<$Result.GetResult<Prisma.$ContentTopicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContentTopic that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentTopicFindFirstArgs} args - Arguments to find a ContentTopic
     * @example
     * // Get one ContentTopic
     * const contentTopic = await prisma.contentTopic.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContentTopicFindFirstArgs>(args?: SelectSubset<T, ContentTopicFindFirstArgs<ExtArgs>>): Prisma__ContentTopicClient<$Result.GetResult<Prisma.$ContentTopicPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContentTopic that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentTopicFindFirstOrThrowArgs} args - Arguments to find a ContentTopic
     * @example
     * // Get one ContentTopic
     * const contentTopic = await prisma.contentTopic.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContentTopicFindFirstOrThrowArgs>(args?: SelectSubset<T, ContentTopicFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContentTopicClient<$Result.GetResult<Prisma.$ContentTopicPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ContentTopics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentTopicFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ContentTopics
     * const contentTopics = await prisma.contentTopic.findMany()
     * 
     * // Get first 10 ContentTopics
     * const contentTopics = await prisma.contentTopic.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contentTopicWithIdOnly = await prisma.contentTopic.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContentTopicFindManyArgs>(args?: SelectSubset<T, ContentTopicFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentTopicPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ContentTopic.
     * @param {ContentTopicCreateArgs} args - Arguments to create a ContentTopic.
     * @example
     * // Create one ContentTopic
     * const ContentTopic = await prisma.contentTopic.create({
     *   data: {
     *     // ... data to create a ContentTopic
     *   }
     * })
     * 
     */
    create<T extends ContentTopicCreateArgs>(args: SelectSubset<T, ContentTopicCreateArgs<ExtArgs>>): Prisma__ContentTopicClient<$Result.GetResult<Prisma.$ContentTopicPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ContentTopics.
     * @param {ContentTopicCreateManyArgs} args - Arguments to create many ContentTopics.
     * @example
     * // Create many ContentTopics
     * const contentTopic = await prisma.contentTopic.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContentTopicCreateManyArgs>(args?: SelectSubset<T, ContentTopicCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ContentTopics and returns the data saved in the database.
     * @param {ContentTopicCreateManyAndReturnArgs} args - Arguments to create many ContentTopics.
     * @example
     * // Create many ContentTopics
     * const contentTopic = await prisma.contentTopic.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ContentTopics and only return the `id`
     * const contentTopicWithIdOnly = await prisma.contentTopic.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ContentTopicCreateManyAndReturnArgs>(args?: SelectSubset<T, ContentTopicCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentTopicPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ContentTopic.
     * @param {ContentTopicDeleteArgs} args - Arguments to delete one ContentTopic.
     * @example
     * // Delete one ContentTopic
     * const ContentTopic = await prisma.contentTopic.delete({
     *   where: {
     *     // ... filter to delete one ContentTopic
     *   }
     * })
     * 
     */
    delete<T extends ContentTopicDeleteArgs>(args: SelectSubset<T, ContentTopicDeleteArgs<ExtArgs>>): Prisma__ContentTopicClient<$Result.GetResult<Prisma.$ContentTopicPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ContentTopic.
     * @param {ContentTopicUpdateArgs} args - Arguments to update one ContentTopic.
     * @example
     * // Update one ContentTopic
     * const contentTopic = await prisma.contentTopic.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContentTopicUpdateArgs>(args: SelectSubset<T, ContentTopicUpdateArgs<ExtArgs>>): Prisma__ContentTopicClient<$Result.GetResult<Prisma.$ContentTopicPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ContentTopics.
     * @param {ContentTopicDeleteManyArgs} args - Arguments to filter ContentTopics to delete.
     * @example
     * // Delete a few ContentTopics
     * const { count } = await prisma.contentTopic.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContentTopicDeleteManyArgs>(args?: SelectSubset<T, ContentTopicDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContentTopics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentTopicUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ContentTopics
     * const contentTopic = await prisma.contentTopic.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContentTopicUpdateManyArgs>(args: SelectSubset<T, ContentTopicUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContentTopics and returns the data updated in the database.
     * @param {ContentTopicUpdateManyAndReturnArgs} args - Arguments to update many ContentTopics.
     * @example
     * // Update many ContentTopics
     * const contentTopic = await prisma.contentTopic.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ContentTopics and only return the `id`
     * const contentTopicWithIdOnly = await prisma.contentTopic.updateManyAndReturn({
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
    updateManyAndReturn<T extends ContentTopicUpdateManyAndReturnArgs>(args: SelectSubset<T, ContentTopicUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentTopicPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ContentTopic.
     * @param {ContentTopicUpsertArgs} args - Arguments to update or create a ContentTopic.
     * @example
     * // Update or create a ContentTopic
     * const contentTopic = await prisma.contentTopic.upsert({
     *   create: {
     *     // ... data to create a ContentTopic
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ContentTopic we want to update
     *   }
     * })
     */
    upsert<T extends ContentTopicUpsertArgs>(args: SelectSubset<T, ContentTopicUpsertArgs<ExtArgs>>): Prisma__ContentTopicClient<$Result.GetResult<Prisma.$ContentTopicPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ContentTopics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentTopicCountArgs} args - Arguments to filter ContentTopics to count.
     * @example
     * // Count the number of ContentTopics
     * const count = await prisma.contentTopic.count({
     *   where: {
     *     // ... the filter for the ContentTopics we want to count
     *   }
     * })
    **/
    count<T extends ContentTopicCountArgs>(
      args?: Subset<T, ContentTopicCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContentTopicCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ContentTopic.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentTopicAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ContentTopicAggregateArgs>(args: Subset<T, ContentTopicAggregateArgs>): Prisma.PrismaPromise<GetContentTopicAggregateType<T>>

    /**
     * Group by ContentTopic.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentTopicGroupByArgs} args - Group by arguments.
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
      T extends ContentTopicGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContentTopicGroupByArgs['orderBy'] }
        : { orderBy?: ContentTopicGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ContentTopicGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContentTopicGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ContentTopic model
   */
  readonly fields: ContentTopicFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ContentTopic.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContentTopicClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    posts<T extends ContentTopic$postsArgs<ExtArgs> = {}>(args?: Subset<T, ContentTopic$postsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentPostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the ContentTopic model
   */
  interface ContentTopicFieldRefs {
    readonly id: FieldRef<"ContentTopic", 'String'>
    readonly name: FieldRef<"ContentTopic", 'String'>
    readonly slug: FieldRef<"ContentTopic", 'String'>
    readonly description: FieldRef<"ContentTopic", 'String'>
    readonly icon: FieldRef<"ContentTopic", 'String'>
    readonly coverUrl: FieldRef<"ContentTopic", 'String'>
    readonly sortOrder: FieldRef<"ContentTopic", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * ContentTopic findUnique
   */
  export type ContentTopicFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentTopic
     */
    select?: ContentTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentTopic
     */
    omit?: ContentTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentTopicInclude<ExtArgs> | null
    /**
     * Filter, which ContentTopic to fetch.
     */
    where: ContentTopicWhereUniqueInput
  }

  /**
   * ContentTopic findUniqueOrThrow
   */
  export type ContentTopicFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentTopic
     */
    select?: ContentTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentTopic
     */
    omit?: ContentTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentTopicInclude<ExtArgs> | null
    /**
     * Filter, which ContentTopic to fetch.
     */
    where: ContentTopicWhereUniqueInput
  }

  /**
   * ContentTopic findFirst
   */
  export type ContentTopicFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentTopic
     */
    select?: ContentTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentTopic
     */
    omit?: ContentTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentTopicInclude<ExtArgs> | null
    /**
     * Filter, which ContentTopic to fetch.
     */
    where?: ContentTopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentTopics to fetch.
     */
    orderBy?: ContentTopicOrderByWithRelationInput | ContentTopicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContentTopics.
     */
    cursor?: ContentTopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentTopics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentTopics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContentTopics.
     */
    distinct?: ContentTopicScalarFieldEnum | ContentTopicScalarFieldEnum[]
  }

  /**
   * ContentTopic findFirstOrThrow
   */
  export type ContentTopicFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentTopic
     */
    select?: ContentTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentTopic
     */
    omit?: ContentTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentTopicInclude<ExtArgs> | null
    /**
     * Filter, which ContentTopic to fetch.
     */
    where?: ContentTopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentTopics to fetch.
     */
    orderBy?: ContentTopicOrderByWithRelationInput | ContentTopicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContentTopics.
     */
    cursor?: ContentTopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentTopics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentTopics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContentTopics.
     */
    distinct?: ContentTopicScalarFieldEnum | ContentTopicScalarFieldEnum[]
  }

  /**
   * ContentTopic findMany
   */
  export type ContentTopicFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentTopic
     */
    select?: ContentTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentTopic
     */
    omit?: ContentTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentTopicInclude<ExtArgs> | null
    /**
     * Filter, which ContentTopics to fetch.
     */
    where?: ContentTopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentTopics to fetch.
     */
    orderBy?: ContentTopicOrderByWithRelationInput | ContentTopicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ContentTopics.
     */
    cursor?: ContentTopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentTopics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentTopics.
     */
    skip?: number
    distinct?: ContentTopicScalarFieldEnum | ContentTopicScalarFieldEnum[]
  }

  /**
   * ContentTopic create
   */
  export type ContentTopicCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentTopic
     */
    select?: ContentTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentTopic
     */
    omit?: ContentTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentTopicInclude<ExtArgs> | null
    /**
     * The data needed to create a ContentTopic.
     */
    data: XOR<ContentTopicCreateInput, ContentTopicUncheckedCreateInput>
  }

  /**
   * ContentTopic createMany
   */
  export type ContentTopicCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ContentTopics.
     */
    data: ContentTopicCreateManyInput | ContentTopicCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContentTopic createManyAndReturn
   */
  export type ContentTopicCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentTopic
     */
    select?: ContentTopicSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContentTopic
     */
    omit?: ContentTopicOmit<ExtArgs> | null
    /**
     * The data used to create many ContentTopics.
     */
    data: ContentTopicCreateManyInput | ContentTopicCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContentTopic update
   */
  export type ContentTopicUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentTopic
     */
    select?: ContentTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentTopic
     */
    omit?: ContentTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentTopicInclude<ExtArgs> | null
    /**
     * The data needed to update a ContentTopic.
     */
    data: XOR<ContentTopicUpdateInput, ContentTopicUncheckedUpdateInput>
    /**
     * Choose, which ContentTopic to update.
     */
    where: ContentTopicWhereUniqueInput
  }

  /**
   * ContentTopic updateMany
   */
  export type ContentTopicUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ContentTopics.
     */
    data: XOR<ContentTopicUpdateManyMutationInput, ContentTopicUncheckedUpdateManyInput>
    /**
     * Filter which ContentTopics to update
     */
    where?: ContentTopicWhereInput
    /**
     * Limit how many ContentTopics to update.
     */
    limit?: number
  }

  /**
   * ContentTopic updateManyAndReturn
   */
  export type ContentTopicUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentTopic
     */
    select?: ContentTopicSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContentTopic
     */
    omit?: ContentTopicOmit<ExtArgs> | null
    /**
     * The data used to update ContentTopics.
     */
    data: XOR<ContentTopicUpdateManyMutationInput, ContentTopicUncheckedUpdateManyInput>
    /**
     * Filter which ContentTopics to update
     */
    where?: ContentTopicWhereInput
    /**
     * Limit how many ContentTopics to update.
     */
    limit?: number
  }

  /**
   * ContentTopic upsert
   */
  export type ContentTopicUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentTopic
     */
    select?: ContentTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentTopic
     */
    omit?: ContentTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentTopicInclude<ExtArgs> | null
    /**
     * The filter to search for the ContentTopic to update in case it exists.
     */
    where: ContentTopicWhereUniqueInput
    /**
     * In case the ContentTopic found by the `where` argument doesn't exist, create a new ContentTopic with this data.
     */
    create: XOR<ContentTopicCreateInput, ContentTopicUncheckedCreateInput>
    /**
     * In case the ContentTopic was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContentTopicUpdateInput, ContentTopicUncheckedUpdateInput>
  }

  /**
   * ContentTopic delete
   */
  export type ContentTopicDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentTopic
     */
    select?: ContentTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentTopic
     */
    omit?: ContentTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentTopicInclude<ExtArgs> | null
    /**
     * Filter which ContentTopic to delete.
     */
    where: ContentTopicWhereUniqueInput
  }

  /**
   * ContentTopic deleteMany
   */
  export type ContentTopicDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContentTopics to delete
     */
    where?: ContentTopicWhereInput
    /**
     * Limit how many ContentTopics to delete.
     */
    limit?: number
  }

  /**
   * ContentTopic.posts
   */
  export type ContentTopic$postsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentPost
     */
    select?: ContentPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentPost
     */
    omit?: ContentPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentPostInclude<ExtArgs> | null
    where?: ContentPostWhereInput
    orderBy?: ContentPostOrderByWithRelationInput | ContentPostOrderByWithRelationInput[]
    cursor?: ContentPostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ContentPostScalarFieldEnum | ContentPostScalarFieldEnum[]
  }

  /**
   * ContentTopic without action
   */
  export type ContentTopicDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentTopic
     */
    select?: ContentTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentTopic
     */
    omit?: ContentTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentTopicInclude<ExtArgs> | null
  }


  /**
   * Model ContentPost
   */

  export type AggregateContentPost = {
    _count: ContentPostCountAggregateOutputType | null
    _min: ContentPostMinAggregateOutputType | null
    _max: ContentPostMaxAggregateOutputType | null
  }

  export type ContentPostMinAggregateOutputType = {
    id: string | null
    title: string | null
    slug: string | null
    excerpt: string | null
    coverUrl: string | null
    kind: $Enums.ContentKind | null
    status: $Enums.ContentStatus | null
    seoTitle: string | null
    seoDescription: string | null
    ogImageUrl: string | null
    city: string | null
    featured: boolean | null
    topicId: string | null
    authorId: string | null
    publishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ContentPostMaxAggregateOutputType = {
    id: string | null
    title: string | null
    slug: string | null
    excerpt: string | null
    coverUrl: string | null
    kind: $Enums.ContentKind | null
    status: $Enums.ContentStatus | null
    seoTitle: string | null
    seoDescription: string | null
    ogImageUrl: string | null
    city: string | null
    featured: boolean | null
    topicId: string | null
    authorId: string | null
    publishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ContentPostCountAggregateOutputType = {
    id: number
    title: number
    slug: number
    excerpt: number
    coverUrl: number
    kind: number
    status: number
    body: number
    seoTitle: number
    seoDescription: number
    ogImageUrl: number
    city: number
    featured: number
    topicId: number
    authorId: number
    publishedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ContentPostMinAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    excerpt?: true
    coverUrl?: true
    kind?: true
    status?: true
    seoTitle?: true
    seoDescription?: true
    ogImageUrl?: true
    city?: true
    featured?: true
    topicId?: true
    authorId?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ContentPostMaxAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    excerpt?: true
    coverUrl?: true
    kind?: true
    status?: true
    seoTitle?: true
    seoDescription?: true
    ogImageUrl?: true
    city?: true
    featured?: true
    topicId?: true
    authorId?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ContentPostCountAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    excerpt?: true
    coverUrl?: true
    kind?: true
    status?: true
    body?: true
    seoTitle?: true
    seoDescription?: true
    ogImageUrl?: true
    city?: true
    featured?: true
    topicId?: true
    authorId?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ContentPostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContentPost to aggregate.
     */
    where?: ContentPostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentPosts to fetch.
     */
    orderBy?: ContentPostOrderByWithRelationInput | ContentPostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContentPostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentPosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentPosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ContentPosts
    **/
    _count?: true | ContentPostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContentPostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContentPostMaxAggregateInputType
  }

  export type GetContentPostAggregateType<T extends ContentPostAggregateArgs> = {
        [P in keyof T & keyof AggregateContentPost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContentPost[P]>
      : GetScalarType<T[P], AggregateContentPost[P]>
  }




  export type ContentPostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContentPostWhereInput
    orderBy?: ContentPostOrderByWithAggregationInput | ContentPostOrderByWithAggregationInput[]
    by: ContentPostScalarFieldEnum[] | ContentPostScalarFieldEnum
    having?: ContentPostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContentPostCountAggregateInputType | true
    _min?: ContentPostMinAggregateInputType
    _max?: ContentPostMaxAggregateInputType
  }

  export type ContentPostGroupByOutputType = {
    id: string
    title: string
    slug: string
    excerpt: string
    coverUrl: string | null
    kind: $Enums.ContentKind
    status: $Enums.ContentStatus
    body: JsonValue
    seoTitle: string
    seoDescription: string
    ogImageUrl: string | null
    city: string | null
    featured: boolean
    topicId: string
    authorId: string | null
    publishedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: ContentPostCountAggregateOutputType | null
    _min: ContentPostMinAggregateOutputType | null
    _max: ContentPostMaxAggregateOutputType | null
  }

  type GetContentPostGroupByPayload<T extends ContentPostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContentPostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContentPostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContentPostGroupByOutputType[P]>
            : GetScalarType<T[P], ContentPostGroupByOutputType[P]>
        }
      >
    >


  export type ContentPostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    excerpt?: boolean
    coverUrl?: boolean
    kind?: boolean
    status?: boolean
    body?: boolean
    seoTitle?: boolean
    seoDescription?: boolean
    ogImageUrl?: boolean
    city?: boolean
    featured?: boolean
    topicId?: boolean
    authorId?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    topic?: boolean | ContentTopicDefaultArgs<ExtArgs>
    author?: boolean | ContentPost$authorArgs<ExtArgs>
  }, ExtArgs["result"]["contentPost"]>

  export type ContentPostSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    excerpt?: boolean
    coverUrl?: boolean
    kind?: boolean
    status?: boolean
    body?: boolean
    seoTitle?: boolean
    seoDescription?: boolean
    ogImageUrl?: boolean
    city?: boolean
    featured?: boolean
    topicId?: boolean
    authorId?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    topic?: boolean | ContentTopicDefaultArgs<ExtArgs>
    author?: boolean | ContentPost$authorArgs<ExtArgs>
  }, ExtArgs["result"]["contentPost"]>

  export type ContentPostSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    excerpt?: boolean
    coverUrl?: boolean
    kind?: boolean
    status?: boolean
    body?: boolean
    seoTitle?: boolean
    seoDescription?: boolean
    ogImageUrl?: boolean
    city?: boolean
    featured?: boolean
    topicId?: boolean
    authorId?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    topic?: boolean | ContentTopicDefaultArgs<ExtArgs>
    author?: boolean | ContentPost$authorArgs<ExtArgs>
  }, ExtArgs["result"]["contentPost"]>

  export type ContentPostSelectScalar = {
    id?: boolean
    title?: boolean
    slug?: boolean
    excerpt?: boolean
    coverUrl?: boolean
    kind?: boolean
    status?: boolean
    body?: boolean
    seoTitle?: boolean
    seoDescription?: boolean
    ogImageUrl?: boolean
    city?: boolean
    featured?: boolean
    topicId?: boolean
    authorId?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ContentPostOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "slug" | "excerpt" | "coverUrl" | "kind" | "status" | "body" | "seoTitle" | "seoDescription" | "ogImageUrl" | "city" | "featured" | "topicId" | "authorId" | "publishedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["contentPost"]>
  export type ContentPostInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    topic?: boolean | ContentTopicDefaultArgs<ExtArgs>
    author?: boolean | ContentPost$authorArgs<ExtArgs>
  }
  export type ContentPostIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    topic?: boolean | ContentTopicDefaultArgs<ExtArgs>
    author?: boolean | ContentPost$authorArgs<ExtArgs>
  }
  export type ContentPostIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    topic?: boolean | ContentTopicDefaultArgs<ExtArgs>
    author?: boolean | ContentPost$authorArgs<ExtArgs>
  }

  export type $ContentPostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ContentPost"
    objects: {
      topic: Prisma.$ContentTopicPayload<ExtArgs>
      author: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      slug: string
      excerpt: string
      coverUrl: string | null
      kind: $Enums.ContentKind
      status: $Enums.ContentStatus
      body: Prisma.JsonValue
      seoTitle: string
      seoDescription: string
      ogImageUrl: string | null
      city: string | null
      featured: boolean
      topicId: string
      authorId: string | null
      publishedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["contentPost"]>
    composites: {}
  }

  type ContentPostGetPayload<S extends boolean | null | undefined | ContentPostDefaultArgs> = $Result.GetResult<Prisma.$ContentPostPayload, S>

  type ContentPostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ContentPostFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ContentPostCountAggregateInputType | true
    }

  export interface ContentPostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ContentPost'], meta: { name: 'ContentPost' } }
    /**
     * Find zero or one ContentPost that matches the filter.
     * @param {ContentPostFindUniqueArgs} args - Arguments to find a ContentPost
     * @example
     * // Get one ContentPost
     * const contentPost = await prisma.contentPost.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContentPostFindUniqueArgs>(args: SelectSubset<T, ContentPostFindUniqueArgs<ExtArgs>>): Prisma__ContentPostClient<$Result.GetResult<Prisma.$ContentPostPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ContentPost that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ContentPostFindUniqueOrThrowArgs} args - Arguments to find a ContentPost
     * @example
     * // Get one ContentPost
     * const contentPost = await prisma.contentPost.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContentPostFindUniqueOrThrowArgs>(args: SelectSubset<T, ContentPostFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContentPostClient<$Result.GetResult<Prisma.$ContentPostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContentPost that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentPostFindFirstArgs} args - Arguments to find a ContentPost
     * @example
     * // Get one ContentPost
     * const contentPost = await prisma.contentPost.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContentPostFindFirstArgs>(args?: SelectSubset<T, ContentPostFindFirstArgs<ExtArgs>>): Prisma__ContentPostClient<$Result.GetResult<Prisma.$ContentPostPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContentPost that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentPostFindFirstOrThrowArgs} args - Arguments to find a ContentPost
     * @example
     * // Get one ContentPost
     * const contentPost = await prisma.contentPost.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContentPostFindFirstOrThrowArgs>(args?: SelectSubset<T, ContentPostFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContentPostClient<$Result.GetResult<Prisma.$ContentPostPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ContentPosts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentPostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ContentPosts
     * const contentPosts = await prisma.contentPost.findMany()
     * 
     * // Get first 10 ContentPosts
     * const contentPosts = await prisma.contentPost.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contentPostWithIdOnly = await prisma.contentPost.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContentPostFindManyArgs>(args?: SelectSubset<T, ContentPostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentPostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ContentPost.
     * @param {ContentPostCreateArgs} args - Arguments to create a ContentPost.
     * @example
     * // Create one ContentPost
     * const ContentPost = await prisma.contentPost.create({
     *   data: {
     *     // ... data to create a ContentPost
     *   }
     * })
     * 
     */
    create<T extends ContentPostCreateArgs>(args: SelectSubset<T, ContentPostCreateArgs<ExtArgs>>): Prisma__ContentPostClient<$Result.GetResult<Prisma.$ContentPostPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ContentPosts.
     * @param {ContentPostCreateManyArgs} args - Arguments to create many ContentPosts.
     * @example
     * // Create many ContentPosts
     * const contentPost = await prisma.contentPost.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContentPostCreateManyArgs>(args?: SelectSubset<T, ContentPostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ContentPosts and returns the data saved in the database.
     * @param {ContentPostCreateManyAndReturnArgs} args - Arguments to create many ContentPosts.
     * @example
     * // Create many ContentPosts
     * const contentPost = await prisma.contentPost.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ContentPosts and only return the `id`
     * const contentPostWithIdOnly = await prisma.contentPost.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ContentPostCreateManyAndReturnArgs>(args?: SelectSubset<T, ContentPostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentPostPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ContentPost.
     * @param {ContentPostDeleteArgs} args - Arguments to delete one ContentPost.
     * @example
     * // Delete one ContentPost
     * const ContentPost = await prisma.contentPost.delete({
     *   where: {
     *     // ... filter to delete one ContentPost
     *   }
     * })
     * 
     */
    delete<T extends ContentPostDeleteArgs>(args: SelectSubset<T, ContentPostDeleteArgs<ExtArgs>>): Prisma__ContentPostClient<$Result.GetResult<Prisma.$ContentPostPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ContentPost.
     * @param {ContentPostUpdateArgs} args - Arguments to update one ContentPost.
     * @example
     * // Update one ContentPost
     * const contentPost = await prisma.contentPost.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContentPostUpdateArgs>(args: SelectSubset<T, ContentPostUpdateArgs<ExtArgs>>): Prisma__ContentPostClient<$Result.GetResult<Prisma.$ContentPostPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ContentPosts.
     * @param {ContentPostDeleteManyArgs} args - Arguments to filter ContentPosts to delete.
     * @example
     * // Delete a few ContentPosts
     * const { count } = await prisma.contentPost.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContentPostDeleteManyArgs>(args?: SelectSubset<T, ContentPostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContentPosts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentPostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ContentPosts
     * const contentPost = await prisma.contentPost.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContentPostUpdateManyArgs>(args: SelectSubset<T, ContentPostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContentPosts and returns the data updated in the database.
     * @param {ContentPostUpdateManyAndReturnArgs} args - Arguments to update many ContentPosts.
     * @example
     * // Update many ContentPosts
     * const contentPost = await prisma.contentPost.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ContentPosts and only return the `id`
     * const contentPostWithIdOnly = await prisma.contentPost.updateManyAndReturn({
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
    updateManyAndReturn<T extends ContentPostUpdateManyAndReturnArgs>(args: SelectSubset<T, ContentPostUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentPostPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ContentPost.
     * @param {ContentPostUpsertArgs} args - Arguments to update or create a ContentPost.
     * @example
     * // Update or create a ContentPost
     * const contentPost = await prisma.contentPost.upsert({
     *   create: {
     *     // ... data to create a ContentPost
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ContentPost we want to update
     *   }
     * })
     */
    upsert<T extends ContentPostUpsertArgs>(args: SelectSubset<T, ContentPostUpsertArgs<ExtArgs>>): Prisma__ContentPostClient<$Result.GetResult<Prisma.$ContentPostPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ContentPosts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentPostCountArgs} args - Arguments to filter ContentPosts to count.
     * @example
     * // Count the number of ContentPosts
     * const count = await prisma.contentPost.count({
     *   where: {
     *     // ... the filter for the ContentPosts we want to count
     *   }
     * })
    **/
    count<T extends ContentPostCountArgs>(
      args?: Subset<T, ContentPostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContentPostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ContentPost.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentPostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ContentPostAggregateArgs>(args: Subset<T, ContentPostAggregateArgs>): Prisma.PrismaPromise<GetContentPostAggregateType<T>>

    /**
     * Group by ContentPost.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentPostGroupByArgs} args - Group by arguments.
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
      T extends ContentPostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContentPostGroupByArgs['orderBy'] }
        : { orderBy?: ContentPostGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ContentPostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContentPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ContentPost model
   */
  readonly fields: ContentPostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ContentPost.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContentPostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    topic<T extends ContentTopicDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ContentTopicDefaultArgs<ExtArgs>>): Prisma__ContentTopicClient<$Result.GetResult<Prisma.$ContentTopicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    author<T extends ContentPost$authorArgs<ExtArgs> = {}>(args?: Subset<T, ContentPost$authorArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ContentPost model
   */
  interface ContentPostFieldRefs {
    readonly id: FieldRef<"ContentPost", 'String'>
    readonly title: FieldRef<"ContentPost", 'String'>
    readonly slug: FieldRef<"ContentPost", 'String'>
    readonly excerpt: FieldRef<"ContentPost", 'String'>
    readonly coverUrl: FieldRef<"ContentPost", 'String'>
    readonly kind: FieldRef<"ContentPost", 'ContentKind'>
    readonly status: FieldRef<"ContentPost", 'ContentStatus'>
    readonly body: FieldRef<"ContentPost", 'Json'>
    readonly seoTitle: FieldRef<"ContentPost", 'String'>
    readonly seoDescription: FieldRef<"ContentPost", 'String'>
    readonly ogImageUrl: FieldRef<"ContentPost", 'String'>
    readonly city: FieldRef<"ContentPost", 'String'>
    readonly featured: FieldRef<"ContentPost", 'Boolean'>
    readonly topicId: FieldRef<"ContentPost", 'String'>
    readonly authorId: FieldRef<"ContentPost", 'String'>
    readonly publishedAt: FieldRef<"ContentPost", 'DateTime'>
    readonly createdAt: FieldRef<"ContentPost", 'DateTime'>
    readonly updatedAt: FieldRef<"ContentPost", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ContentPost findUnique
   */
  export type ContentPostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentPost
     */
    select?: ContentPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentPost
     */
    omit?: ContentPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentPostInclude<ExtArgs> | null
    /**
     * Filter, which ContentPost to fetch.
     */
    where: ContentPostWhereUniqueInput
  }

  /**
   * ContentPost findUniqueOrThrow
   */
  export type ContentPostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentPost
     */
    select?: ContentPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentPost
     */
    omit?: ContentPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentPostInclude<ExtArgs> | null
    /**
     * Filter, which ContentPost to fetch.
     */
    where: ContentPostWhereUniqueInput
  }

  /**
   * ContentPost findFirst
   */
  export type ContentPostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentPost
     */
    select?: ContentPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentPost
     */
    omit?: ContentPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentPostInclude<ExtArgs> | null
    /**
     * Filter, which ContentPost to fetch.
     */
    where?: ContentPostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentPosts to fetch.
     */
    orderBy?: ContentPostOrderByWithRelationInput | ContentPostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContentPosts.
     */
    cursor?: ContentPostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentPosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentPosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContentPosts.
     */
    distinct?: ContentPostScalarFieldEnum | ContentPostScalarFieldEnum[]
  }

  /**
   * ContentPost findFirstOrThrow
   */
  export type ContentPostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentPost
     */
    select?: ContentPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentPost
     */
    omit?: ContentPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentPostInclude<ExtArgs> | null
    /**
     * Filter, which ContentPost to fetch.
     */
    where?: ContentPostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentPosts to fetch.
     */
    orderBy?: ContentPostOrderByWithRelationInput | ContentPostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContentPosts.
     */
    cursor?: ContentPostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentPosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentPosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContentPosts.
     */
    distinct?: ContentPostScalarFieldEnum | ContentPostScalarFieldEnum[]
  }

  /**
   * ContentPost findMany
   */
  export type ContentPostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentPost
     */
    select?: ContentPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentPost
     */
    omit?: ContentPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentPostInclude<ExtArgs> | null
    /**
     * Filter, which ContentPosts to fetch.
     */
    where?: ContentPostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentPosts to fetch.
     */
    orderBy?: ContentPostOrderByWithRelationInput | ContentPostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ContentPosts.
     */
    cursor?: ContentPostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentPosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentPosts.
     */
    skip?: number
    distinct?: ContentPostScalarFieldEnum | ContentPostScalarFieldEnum[]
  }

  /**
   * ContentPost create
   */
  export type ContentPostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentPost
     */
    select?: ContentPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentPost
     */
    omit?: ContentPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentPostInclude<ExtArgs> | null
    /**
     * The data needed to create a ContentPost.
     */
    data: XOR<ContentPostCreateInput, ContentPostUncheckedCreateInput>
  }

  /**
   * ContentPost createMany
   */
  export type ContentPostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ContentPosts.
     */
    data: ContentPostCreateManyInput | ContentPostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContentPost createManyAndReturn
   */
  export type ContentPostCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentPost
     */
    select?: ContentPostSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContentPost
     */
    omit?: ContentPostOmit<ExtArgs> | null
    /**
     * The data used to create many ContentPosts.
     */
    data: ContentPostCreateManyInput | ContentPostCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentPostIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ContentPost update
   */
  export type ContentPostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentPost
     */
    select?: ContentPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentPost
     */
    omit?: ContentPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentPostInclude<ExtArgs> | null
    /**
     * The data needed to update a ContentPost.
     */
    data: XOR<ContentPostUpdateInput, ContentPostUncheckedUpdateInput>
    /**
     * Choose, which ContentPost to update.
     */
    where: ContentPostWhereUniqueInput
  }

  /**
   * ContentPost updateMany
   */
  export type ContentPostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ContentPosts.
     */
    data: XOR<ContentPostUpdateManyMutationInput, ContentPostUncheckedUpdateManyInput>
    /**
     * Filter which ContentPosts to update
     */
    where?: ContentPostWhereInput
    /**
     * Limit how many ContentPosts to update.
     */
    limit?: number
  }

  /**
   * ContentPost updateManyAndReturn
   */
  export type ContentPostUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentPost
     */
    select?: ContentPostSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContentPost
     */
    omit?: ContentPostOmit<ExtArgs> | null
    /**
     * The data used to update ContentPosts.
     */
    data: XOR<ContentPostUpdateManyMutationInput, ContentPostUncheckedUpdateManyInput>
    /**
     * Filter which ContentPosts to update
     */
    where?: ContentPostWhereInput
    /**
     * Limit how many ContentPosts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentPostIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ContentPost upsert
   */
  export type ContentPostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentPost
     */
    select?: ContentPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentPost
     */
    omit?: ContentPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentPostInclude<ExtArgs> | null
    /**
     * The filter to search for the ContentPost to update in case it exists.
     */
    where: ContentPostWhereUniqueInput
    /**
     * In case the ContentPost found by the `where` argument doesn't exist, create a new ContentPost with this data.
     */
    create: XOR<ContentPostCreateInput, ContentPostUncheckedCreateInput>
    /**
     * In case the ContentPost was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContentPostUpdateInput, ContentPostUncheckedUpdateInput>
  }

  /**
   * ContentPost delete
   */
  export type ContentPostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentPost
     */
    select?: ContentPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentPost
     */
    omit?: ContentPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentPostInclude<ExtArgs> | null
    /**
     * Filter which ContentPost to delete.
     */
    where: ContentPostWhereUniqueInput
  }

  /**
   * ContentPost deleteMany
   */
  export type ContentPostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContentPosts to delete
     */
    where?: ContentPostWhereInput
    /**
     * Limit how many ContentPosts to delete.
     */
    limit?: number
  }

  /**
   * ContentPost.author
   */
  export type ContentPost$authorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * ContentPost without action
   */
  export type ContentPostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentPost
     */
    select?: ContentPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentPost
     */
    omit?: ContentPostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentPostInclude<ExtArgs> | null
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
    name: 'name',
    role: 'role',
    blocked: 'blocked',
    refreshTokenHash: 'refreshTokenHash',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const PushDeviceScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    token: 'token',
    platform: 'platform',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PushDeviceScalarFieldEnum = (typeof PushDeviceScalarFieldEnum)[keyof typeof PushDeviceScalarFieldEnum]


  export const ExternalVendorScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    category: 'category',
    city: 'city',
    phone: 'phone',
    website: 'website',
    quotedPrice: 'quotedPrice',
    notes: 'notes',
    stage: 'stage',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ExternalVendorScalarFieldEnum = (typeof ExternalVendorScalarFieldEnum)[keyof typeof ExternalVendorScalarFieldEnum]


  export const WeddingScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    date: 'date',
    city: 'city',
    guests: 'guests',
    budget: 'budget',
    partnerOneName: 'partnerOneName',
    partnerTwoName: 'partnerTwoName',
    couplePhotoUrl: 'couplePhotoUrl',
    planningStage: 'planningStage',
    cityUndecided: 'cityUndecided',
    guestsUndecided: 'guestsUndecided',
    dayPlan: 'dayPlan'
  };

  export type WeddingScalarFieldEnum = (typeof WeddingScalarFieldEnum)[keyof typeof WeddingScalarFieldEnum]


  export const WeddingWebsiteScalarFieldEnum: {
    id: 'id',
    weddingId: 'weddingId',
    slug: 'slug',
    templateId: 'templateId',
    published: 'published',
    publishedAt: 'publishedAt',
    content: 'content',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WeddingWebsiteScalarFieldEnum = (typeof WeddingWebsiteScalarFieldEnum)[keyof typeof WeddingWebsiteScalarFieldEnum]


  export const WeddingInvitationScalarFieldEnum: {
    id: 'id',
    weddingId: 'weddingId',
    templateId: 'templateId',
    content: 'content',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WeddingInvitationScalarFieldEnum = (typeof WeddingInvitationScalarFieldEnum)[keyof typeof WeddingInvitationScalarFieldEnum]


  export const WeddingMemberScalarFieldEnum: {
    id: 'id',
    weddingId: 'weddingId',
    userId: 'userId',
    role: 'role',
    createdAt: 'createdAt'
  };

  export type WeddingMemberScalarFieldEnum = (typeof WeddingMemberScalarFieldEnum)[keyof typeof WeddingMemberScalarFieldEnum]


  export const WeddingInviteScalarFieldEnum: {
    id: 'id',
    weddingId: 'weddingId',
    token: 'token',
    expiresAt: 'expiresAt',
    acceptedAt: 'acceptedAt',
    acceptedBy: 'acceptedBy',
    createdAt: 'createdAt'
  };

  export type WeddingInviteScalarFieldEnum = (typeof WeddingInviteScalarFieldEnum)[keyof typeof WeddingInviteScalarFieldEnum]


  export const TaskScalarFieldEnum: {
    id: 'id',
    weddingId: 'weddingId',
    title: 'title',
    categorySlug: 'categorySlug',
    status: 'status',
    dueDate: 'dueDate',
    dueRemindedAt: 'dueRemindedAt',
    sortOrder: 'sortOrder',
    isCustom: 'isCustom',
    assignee: 'assignee'
  };

  export type TaskScalarFieldEnum = (typeof TaskScalarFieldEnum)[keyof typeof TaskScalarFieldEnum]


  export const GuestScalarFieldEnum: {
    id: 'id',
    weddingId: 'weddingId',
    name: 'name',
    email: 'email',
    phone: 'phone',
    side: 'side',
    rsvpStatus: 'rsvpStatus',
    plusOne: 'plusOne',
    plusOneName: 'plusOneName',
    plusOneAttending: 'plusOneAttending',
    allergies: 'allergies',
    tableLabel: 'tableLabel',
    notes: 'notes',
    inviteToken: 'inviteToken',
    respondedAt: 'respondedAt',
    createdAt: 'createdAt'
  };

  export type GuestScalarFieldEnum = (typeof GuestScalarFieldEnum)[keyof typeof GuestScalarFieldEnum]


  export const BudgetItemScalarFieldEnum: {
    id: 'id',
    weddingId: 'weddingId',
    category: 'category',
    title: 'title',
    estimated: 'estimated',
    actual: 'actual',
    paid: 'paid',
    notes: 'notes',
    externalVendorId: 'externalVendorId',
    createdAt: 'createdAt'
  };

  export type BudgetItemScalarFieldEnum = (typeof BudgetItemScalarFieldEnum)[keyof typeof BudgetItemScalarFieldEnum]


  export const ContentTopicScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    icon: 'icon',
    coverUrl: 'coverUrl',
    sortOrder: 'sortOrder'
  };

  export type ContentTopicScalarFieldEnum = (typeof ContentTopicScalarFieldEnum)[keyof typeof ContentTopicScalarFieldEnum]


  export const ContentPostScalarFieldEnum: {
    id: 'id',
    title: 'title',
    slug: 'slug',
    excerpt: 'excerpt',
    coverUrl: 'coverUrl',
    kind: 'kind',
    status: 'status',
    body: 'body',
    seoTitle: 'seoTitle',
    seoDescription: 'seoDescription',
    ogImageUrl: 'ogImageUrl',
    city: 'city',
    featured: 'featured',
    topicId: 'topicId',
    authorId: 'authorId',
    publishedAt: 'publishedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ContentPostScalarFieldEnum = (typeof ContentPostScalarFieldEnum)[keyof typeof ContentPostScalarFieldEnum]


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


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


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
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


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
   * Reference to a field of type 'VendorPipelineStage'
   */
  export type EnumVendorPipelineStageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VendorPipelineStage'>
    


  /**
   * Reference to a field of type 'VendorPipelineStage[]'
   */
  export type ListEnumVendorPipelineStageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VendorPipelineStage[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'WeddingMemberRole'
   */
  export type EnumWeddingMemberRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WeddingMemberRole'>
    


  /**
   * Reference to a field of type 'WeddingMemberRole[]'
   */
  export type ListEnumWeddingMemberRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WeddingMemberRole[]'>
    


  /**
   * Reference to a field of type 'TaskStatus'
   */
  export type EnumTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskStatus'>
    


  /**
   * Reference to a field of type 'TaskStatus[]'
   */
  export type ListEnumTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskStatus[]'>
    


  /**
   * Reference to a field of type 'GuestSide'
   */
  export type EnumGuestSideFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GuestSide'>
    


  /**
   * Reference to a field of type 'GuestSide[]'
   */
  export type ListEnumGuestSideFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GuestSide[]'>
    


  /**
   * Reference to a field of type 'RsvpStatus'
   */
  export type EnumRsvpStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RsvpStatus'>
    


  /**
   * Reference to a field of type 'RsvpStatus[]'
   */
  export type ListEnumRsvpStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RsvpStatus[]'>
    


  /**
   * Reference to a field of type 'ContentKind'
   */
  export type EnumContentKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ContentKind'>
    


  /**
   * Reference to a field of type 'ContentKind[]'
   */
  export type ListEnumContentKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ContentKind[]'>
    


  /**
   * Reference to a field of type 'ContentStatus'
   */
  export type EnumContentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ContentStatus'>
    


  /**
   * Reference to a field of type 'ContentStatus[]'
   */
  export type ListEnumContentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ContentStatus[]'>
    


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
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    blocked?: BoolFilter<"User"> | boolean
    refreshTokenHash?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    wedding?: XOR<WeddingNullableScalarRelationFilter, WeddingWhereInput> | null
    weddingMember?: XOR<WeddingMemberNullableScalarRelationFilter, WeddingMemberWhereInput> | null
    externalVendors?: ExternalVendorListRelationFilter
    contentPosts?: ContentPostListRelationFilter
    pushDevices?: PushDeviceListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    blocked?: SortOrder
    refreshTokenHash?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    wedding?: WeddingOrderByWithRelationInput
    weddingMember?: WeddingMemberOrderByWithRelationInput
    externalVendors?: ExternalVendorOrderByRelationAggregateInput
    contentPosts?: ContentPostOrderByRelationAggregateInput
    pushDevices?: PushDeviceOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    blocked?: BoolFilter<"User"> | boolean
    refreshTokenHash?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    wedding?: XOR<WeddingNullableScalarRelationFilter, WeddingWhereInput> | null
    weddingMember?: XOR<WeddingMemberNullableScalarRelationFilter, WeddingMemberWhereInput> | null
    externalVendors?: ExternalVendorListRelationFilter
    contentPosts?: ContentPostListRelationFilter
    pushDevices?: PushDeviceListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    blocked?: SortOrder
    refreshTokenHash?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    blocked?: BoolWithAggregatesFilter<"User"> | boolean
    refreshTokenHash?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type PushDeviceWhereInput = {
    AND?: PushDeviceWhereInput | PushDeviceWhereInput[]
    OR?: PushDeviceWhereInput[]
    NOT?: PushDeviceWhereInput | PushDeviceWhereInput[]
    id?: StringFilter<"PushDevice"> | string
    userId?: StringFilter<"PushDevice"> | string
    token?: StringFilter<"PushDevice"> | string
    platform?: StringFilter<"PushDevice"> | string
    createdAt?: DateTimeFilter<"PushDevice"> | Date | string
    updatedAt?: DateTimeFilter<"PushDevice"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PushDeviceOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    platform?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PushDeviceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: PushDeviceWhereInput | PushDeviceWhereInput[]
    OR?: PushDeviceWhereInput[]
    NOT?: PushDeviceWhereInput | PushDeviceWhereInput[]
    userId?: StringFilter<"PushDevice"> | string
    platform?: StringFilter<"PushDevice"> | string
    createdAt?: DateTimeFilter<"PushDevice"> | Date | string
    updatedAt?: DateTimeFilter<"PushDevice"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type PushDeviceOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    platform?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PushDeviceCountOrderByAggregateInput
    _max?: PushDeviceMaxOrderByAggregateInput
    _min?: PushDeviceMinOrderByAggregateInput
  }

  export type PushDeviceScalarWhereWithAggregatesInput = {
    AND?: PushDeviceScalarWhereWithAggregatesInput | PushDeviceScalarWhereWithAggregatesInput[]
    OR?: PushDeviceScalarWhereWithAggregatesInput[]
    NOT?: PushDeviceScalarWhereWithAggregatesInput | PushDeviceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PushDevice"> | string
    userId?: StringWithAggregatesFilter<"PushDevice"> | string
    token?: StringWithAggregatesFilter<"PushDevice"> | string
    platform?: StringWithAggregatesFilter<"PushDevice"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PushDevice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PushDevice"> | Date | string
  }

  export type ExternalVendorWhereInput = {
    AND?: ExternalVendorWhereInput | ExternalVendorWhereInput[]
    OR?: ExternalVendorWhereInput[]
    NOT?: ExternalVendorWhereInput | ExternalVendorWhereInput[]
    id?: StringFilter<"ExternalVendor"> | string
    userId?: StringFilter<"ExternalVendor"> | string
    name?: StringFilter<"ExternalVendor"> | string
    category?: StringFilter<"ExternalVendor"> | string
    city?: StringFilter<"ExternalVendor"> | string
    phone?: StringNullableFilter<"ExternalVendor"> | string | null
    website?: StringNullableFilter<"ExternalVendor"> | string | null
    quotedPrice?: IntNullableFilter<"ExternalVendor"> | number | null
    notes?: StringNullableFilter<"ExternalVendor"> | string | null
    stage?: EnumVendorPipelineStageFilter<"ExternalVendor"> | $Enums.VendorPipelineStage
    createdAt?: DateTimeFilter<"ExternalVendor"> | Date | string
    updatedAt?: DateTimeFilter<"ExternalVendor"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    budgetItem?: XOR<BudgetItemNullableScalarRelationFilter, BudgetItemWhereInput> | null
  }

  export type ExternalVendorOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    category?: SortOrder
    city?: SortOrder
    phone?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    quotedPrice?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    stage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    budgetItem?: BudgetItemOrderByWithRelationInput
  }

  export type ExternalVendorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExternalVendorWhereInput | ExternalVendorWhereInput[]
    OR?: ExternalVendorWhereInput[]
    NOT?: ExternalVendorWhereInput | ExternalVendorWhereInput[]
    userId?: StringFilter<"ExternalVendor"> | string
    name?: StringFilter<"ExternalVendor"> | string
    category?: StringFilter<"ExternalVendor"> | string
    city?: StringFilter<"ExternalVendor"> | string
    phone?: StringNullableFilter<"ExternalVendor"> | string | null
    website?: StringNullableFilter<"ExternalVendor"> | string | null
    quotedPrice?: IntNullableFilter<"ExternalVendor"> | number | null
    notes?: StringNullableFilter<"ExternalVendor"> | string | null
    stage?: EnumVendorPipelineStageFilter<"ExternalVendor"> | $Enums.VendorPipelineStage
    createdAt?: DateTimeFilter<"ExternalVendor"> | Date | string
    updatedAt?: DateTimeFilter<"ExternalVendor"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    budgetItem?: XOR<BudgetItemNullableScalarRelationFilter, BudgetItemWhereInput> | null
  }, "id">

  export type ExternalVendorOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    category?: SortOrder
    city?: SortOrder
    phone?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    quotedPrice?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    stage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ExternalVendorCountOrderByAggregateInput
    _avg?: ExternalVendorAvgOrderByAggregateInput
    _max?: ExternalVendorMaxOrderByAggregateInput
    _min?: ExternalVendorMinOrderByAggregateInput
    _sum?: ExternalVendorSumOrderByAggregateInput
  }

  export type ExternalVendorScalarWhereWithAggregatesInput = {
    AND?: ExternalVendorScalarWhereWithAggregatesInput | ExternalVendorScalarWhereWithAggregatesInput[]
    OR?: ExternalVendorScalarWhereWithAggregatesInput[]
    NOT?: ExternalVendorScalarWhereWithAggregatesInput | ExternalVendorScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ExternalVendor"> | string
    userId?: StringWithAggregatesFilter<"ExternalVendor"> | string
    name?: StringWithAggregatesFilter<"ExternalVendor"> | string
    category?: StringWithAggregatesFilter<"ExternalVendor"> | string
    city?: StringWithAggregatesFilter<"ExternalVendor"> | string
    phone?: StringNullableWithAggregatesFilter<"ExternalVendor"> | string | null
    website?: StringNullableWithAggregatesFilter<"ExternalVendor"> | string | null
    quotedPrice?: IntNullableWithAggregatesFilter<"ExternalVendor"> | number | null
    notes?: StringNullableWithAggregatesFilter<"ExternalVendor"> | string | null
    stage?: EnumVendorPipelineStageWithAggregatesFilter<"ExternalVendor"> | $Enums.VendorPipelineStage
    createdAt?: DateTimeWithAggregatesFilter<"ExternalVendor"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ExternalVendor"> | Date | string
  }

  export type WeddingWhereInput = {
    AND?: WeddingWhereInput | WeddingWhereInput[]
    OR?: WeddingWhereInput[]
    NOT?: WeddingWhereInput | WeddingWhereInput[]
    id?: StringFilter<"Wedding"> | string
    userId?: StringFilter<"Wedding"> | string
    date?: DateTimeFilter<"Wedding"> | Date | string
    city?: StringFilter<"Wedding"> | string
    guests?: IntFilter<"Wedding"> | number
    budget?: IntFilter<"Wedding"> | number
    partnerOneName?: StringFilter<"Wedding"> | string
    partnerTwoName?: StringFilter<"Wedding"> | string
    couplePhotoUrl?: StringNullableFilter<"Wedding"> | string | null
    planningStage?: StringFilter<"Wedding"> | string
    cityUndecided?: BoolFilter<"Wedding"> | boolean
    guestsUndecided?: BoolFilter<"Wedding"> | boolean
    dayPlan?: JsonNullableFilter<"Wedding">
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    members?: WeddingMemberListRelationFilter
    invites?: WeddingInviteListRelationFilter
    tasks?: TaskListRelationFilter
    guestList?: GuestListRelationFilter
    budgetItems?: BudgetItemListRelationFilter
    website?: XOR<WeddingWebsiteNullableScalarRelationFilter, WeddingWebsiteWhereInput> | null
    invitation?: XOR<WeddingInvitationNullableScalarRelationFilter, WeddingInvitationWhereInput> | null
  }

  export type WeddingOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    date?: SortOrder
    city?: SortOrder
    guests?: SortOrder
    budget?: SortOrder
    partnerOneName?: SortOrder
    partnerTwoName?: SortOrder
    couplePhotoUrl?: SortOrderInput | SortOrder
    planningStage?: SortOrder
    cityUndecided?: SortOrder
    guestsUndecided?: SortOrder
    dayPlan?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    members?: WeddingMemberOrderByRelationAggregateInput
    invites?: WeddingInviteOrderByRelationAggregateInput
    tasks?: TaskOrderByRelationAggregateInput
    guestList?: GuestOrderByRelationAggregateInput
    budgetItems?: BudgetItemOrderByRelationAggregateInput
    website?: WeddingWebsiteOrderByWithRelationInput
    invitation?: WeddingInvitationOrderByWithRelationInput
  }

  export type WeddingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: WeddingWhereInput | WeddingWhereInput[]
    OR?: WeddingWhereInput[]
    NOT?: WeddingWhereInput | WeddingWhereInput[]
    date?: DateTimeFilter<"Wedding"> | Date | string
    city?: StringFilter<"Wedding"> | string
    guests?: IntFilter<"Wedding"> | number
    budget?: IntFilter<"Wedding"> | number
    partnerOneName?: StringFilter<"Wedding"> | string
    partnerTwoName?: StringFilter<"Wedding"> | string
    couplePhotoUrl?: StringNullableFilter<"Wedding"> | string | null
    planningStage?: StringFilter<"Wedding"> | string
    cityUndecided?: BoolFilter<"Wedding"> | boolean
    guestsUndecided?: BoolFilter<"Wedding"> | boolean
    dayPlan?: JsonNullableFilter<"Wedding">
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    members?: WeddingMemberListRelationFilter
    invites?: WeddingInviteListRelationFilter
    tasks?: TaskListRelationFilter
    guestList?: GuestListRelationFilter
    budgetItems?: BudgetItemListRelationFilter
    website?: XOR<WeddingWebsiteNullableScalarRelationFilter, WeddingWebsiteWhereInput> | null
    invitation?: XOR<WeddingInvitationNullableScalarRelationFilter, WeddingInvitationWhereInput> | null
  }, "id" | "userId">

  export type WeddingOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    date?: SortOrder
    city?: SortOrder
    guests?: SortOrder
    budget?: SortOrder
    partnerOneName?: SortOrder
    partnerTwoName?: SortOrder
    couplePhotoUrl?: SortOrderInput | SortOrder
    planningStage?: SortOrder
    cityUndecided?: SortOrder
    guestsUndecided?: SortOrder
    dayPlan?: SortOrderInput | SortOrder
    _count?: WeddingCountOrderByAggregateInput
    _avg?: WeddingAvgOrderByAggregateInput
    _max?: WeddingMaxOrderByAggregateInput
    _min?: WeddingMinOrderByAggregateInput
    _sum?: WeddingSumOrderByAggregateInput
  }

  export type WeddingScalarWhereWithAggregatesInput = {
    AND?: WeddingScalarWhereWithAggregatesInput | WeddingScalarWhereWithAggregatesInput[]
    OR?: WeddingScalarWhereWithAggregatesInput[]
    NOT?: WeddingScalarWhereWithAggregatesInput | WeddingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Wedding"> | string
    userId?: StringWithAggregatesFilter<"Wedding"> | string
    date?: DateTimeWithAggregatesFilter<"Wedding"> | Date | string
    city?: StringWithAggregatesFilter<"Wedding"> | string
    guests?: IntWithAggregatesFilter<"Wedding"> | number
    budget?: IntWithAggregatesFilter<"Wedding"> | number
    partnerOneName?: StringWithAggregatesFilter<"Wedding"> | string
    partnerTwoName?: StringWithAggregatesFilter<"Wedding"> | string
    couplePhotoUrl?: StringNullableWithAggregatesFilter<"Wedding"> | string | null
    planningStage?: StringWithAggregatesFilter<"Wedding"> | string
    cityUndecided?: BoolWithAggregatesFilter<"Wedding"> | boolean
    guestsUndecided?: BoolWithAggregatesFilter<"Wedding"> | boolean
    dayPlan?: JsonNullableWithAggregatesFilter<"Wedding">
  }

  export type WeddingWebsiteWhereInput = {
    AND?: WeddingWebsiteWhereInput | WeddingWebsiteWhereInput[]
    OR?: WeddingWebsiteWhereInput[]
    NOT?: WeddingWebsiteWhereInput | WeddingWebsiteWhereInput[]
    id?: StringFilter<"WeddingWebsite"> | string
    weddingId?: StringFilter<"WeddingWebsite"> | string
    slug?: StringFilter<"WeddingWebsite"> | string
    templateId?: StringFilter<"WeddingWebsite"> | string
    published?: BoolFilter<"WeddingWebsite"> | boolean
    publishedAt?: DateTimeNullableFilter<"WeddingWebsite"> | Date | string | null
    content?: JsonFilter<"WeddingWebsite">
    createdAt?: DateTimeFilter<"WeddingWebsite"> | Date | string
    updatedAt?: DateTimeFilter<"WeddingWebsite"> | Date | string
    wedding?: XOR<WeddingScalarRelationFilter, WeddingWhereInput>
  }

  export type WeddingWebsiteOrderByWithRelationInput = {
    id?: SortOrder
    weddingId?: SortOrder
    slug?: SortOrder
    templateId?: SortOrder
    published?: SortOrder
    publishedAt?: SortOrderInput | SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    wedding?: WeddingOrderByWithRelationInput
  }

  export type WeddingWebsiteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    weddingId?: string
    slug?: string
    AND?: WeddingWebsiteWhereInput | WeddingWebsiteWhereInput[]
    OR?: WeddingWebsiteWhereInput[]
    NOT?: WeddingWebsiteWhereInput | WeddingWebsiteWhereInput[]
    templateId?: StringFilter<"WeddingWebsite"> | string
    published?: BoolFilter<"WeddingWebsite"> | boolean
    publishedAt?: DateTimeNullableFilter<"WeddingWebsite"> | Date | string | null
    content?: JsonFilter<"WeddingWebsite">
    createdAt?: DateTimeFilter<"WeddingWebsite"> | Date | string
    updatedAt?: DateTimeFilter<"WeddingWebsite"> | Date | string
    wedding?: XOR<WeddingScalarRelationFilter, WeddingWhereInput>
  }, "id" | "weddingId" | "slug">

  export type WeddingWebsiteOrderByWithAggregationInput = {
    id?: SortOrder
    weddingId?: SortOrder
    slug?: SortOrder
    templateId?: SortOrder
    published?: SortOrder
    publishedAt?: SortOrderInput | SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WeddingWebsiteCountOrderByAggregateInput
    _max?: WeddingWebsiteMaxOrderByAggregateInput
    _min?: WeddingWebsiteMinOrderByAggregateInput
  }

  export type WeddingWebsiteScalarWhereWithAggregatesInput = {
    AND?: WeddingWebsiteScalarWhereWithAggregatesInput | WeddingWebsiteScalarWhereWithAggregatesInput[]
    OR?: WeddingWebsiteScalarWhereWithAggregatesInput[]
    NOT?: WeddingWebsiteScalarWhereWithAggregatesInput | WeddingWebsiteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WeddingWebsite"> | string
    weddingId?: StringWithAggregatesFilter<"WeddingWebsite"> | string
    slug?: StringWithAggregatesFilter<"WeddingWebsite"> | string
    templateId?: StringWithAggregatesFilter<"WeddingWebsite"> | string
    published?: BoolWithAggregatesFilter<"WeddingWebsite"> | boolean
    publishedAt?: DateTimeNullableWithAggregatesFilter<"WeddingWebsite"> | Date | string | null
    content?: JsonWithAggregatesFilter<"WeddingWebsite">
    createdAt?: DateTimeWithAggregatesFilter<"WeddingWebsite"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WeddingWebsite"> | Date | string
  }

  export type WeddingInvitationWhereInput = {
    AND?: WeddingInvitationWhereInput | WeddingInvitationWhereInput[]
    OR?: WeddingInvitationWhereInput[]
    NOT?: WeddingInvitationWhereInput | WeddingInvitationWhereInput[]
    id?: StringFilter<"WeddingInvitation"> | string
    weddingId?: StringFilter<"WeddingInvitation"> | string
    templateId?: StringFilter<"WeddingInvitation"> | string
    content?: JsonFilter<"WeddingInvitation">
    createdAt?: DateTimeFilter<"WeddingInvitation"> | Date | string
    updatedAt?: DateTimeFilter<"WeddingInvitation"> | Date | string
    wedding?: XOR<WeddingScalarRelationFilter, WeddingWhereInput>
  }

  export type WeddingInvitationOrderByWithRelationInput = {
    id?: SortOrder
    weddingId?: SortOrder
    templateId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    wedding?: WeddingOrderByWithRelationInput
  }

  export type WeddingInvitationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    weddingId?: string
    AND?: WeddingInvitationWhereInput | WeddingInvitationWhereInput[]
    OR?: WeddingInvitationWhereInput[]
    NOT?: WeddingInvitationWhereInput | WeddingInvitationWhereInput[]
    templateId?: StringFilter<"WeddingInvitation"> | string
    content?: JsonFilter<"WeddingInvitation">
    createdAt?: DateTimeFilter<"WeddingInvitation"> | Date | string
    updatedAt?: DateTimeFilter<"WeddingInvitation"> | Date | string
    wedding?: XOR<WeddingScalarRelationFilter, WeddingWhereInput>
  }, "id" | "weddingId">

  export type WeddingInvitationOrderByWithAggregationInput = {
    id?: SortOrder
    weddingId?: SortOrder
    templateId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WeddingInvitationCountOrderByAggregateInput
    _max?: WeddingInvitationMaxOrderByAggregateInput
    _min?: WeddingInvitationMinOrderByAggregateInput
  }

  export type WeddingInvitationScalarWhereWithAggregatesInput = {
    AND?: WeddingInvitationScalarWhereWithAggregatesInput | WeddingInvitationScalarWhereWithAggregatesInput[]
    OR?: WeddingInvitationScalarWhereWithAggregatesInput[]
    NOT?: WeddingInvitationScalarWhereWithAggregatesInput | WeddingInvitationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WeddingInvitation"> | string
    weddingId?: StringWithAggregatesFilter<"WeddingInvitation"> | string
    templateId?: StringWithAggregatesFilter<"WeddingInvitation"> | string
    content?: JsonWithAggregatesFilter<"WeddingInvitation">
    createdAt?: DateTimeWithAggregatesFilter<"WeddingInvitation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WeddingInvitation"> | Date | string
  }

  export type WeddingMemberWhereInput = {
    AND?: WeddingMemberWhereInput | WeddingMemberWhereInput[]
    OR?: WeddingMemberWhereInput[]
    NOT?: WeddingMemberWhereInput | WeddingMemberWhereInput[]
    id?: StringFilter<"WeddingMember"> | string
    weddingId?: StringFilter<"WeddingMember"> | string
    userId?: StringFilter<"WeddingMember"> | string
    role?: EnumWeddingMemberRoleFilter<"WeddingMember"> | $Enums.WeddingMemberRole
    createdAt?: DateTimeFilter<"WeddingMember"> | Date | string
    wedding?: XOR<WeddingScalarRelationFilter, WeddingWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type WeddingMemberOrderByWithRelationInput = {
    id?: SortOrder
    weddingId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    wedding?: WeddingOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type WeddingMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: WeddingMemberWhereInput | WeddingMemberWhereInput[]
    OR?: WeddingMemberWhereInput[]
    NOT?: WeddingMemberWhereInput | WeddingMemberWhereInput[]
    weddingId?: StringFilter<"WeddingMember"> | string
    role?: EnumWeddingMemberRoleFilter<"WeddingMember"> | $Enums.WeddingMemberRole
    createdAt?: DateTimeFilter<"WeddingMember"> | Date | string
    wedding?: XOR<WeddingScalarRelationFilter, WeddingWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type WeddingMemberOrderByWithAggregationInput = {
    id?: SortOrder
    weddingId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    _count?: WeddingMemberCountOrderByAggregateInput
    _max?: WeddingMemberMaxOrderByAggregateInput
    _min?: WeddingMemberMinOrderByAggregateInput
  }

  export type WeddingMemberScalarWhereWithAggregatesInput = {
    AND?: WeddingMemberScalarWhereWithAggregatesInput | WeddingMemberScalarWhereWithAggregatesInput[]
    OR?: WeddingMemberScalarWhereWithAggregatesInput[]
    NOT?: WeddingMemberScalarWhereWithAggregatesInput | WeddingMemberScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WeddingMember"> | string
    weddingId?: StringWithAggregatesFilter<"WeddingMember"> | string
    userId?: StringWithAggregatesFilter<"WeddingMember"> | string
    role?: EnumWeddingMemberRoleWithAggregatesFilter<"WeddingMember"> | $Enums.WeddingMemberRole
    createdAt?: DateTimeWithAggregatesFilter<"WeddingMember"> | Date | string
  }

  export type WeddingInviteWhereInput = {
    AND?: WeddingInviteWhereInput | WeddingInviteWhereInput[]
    OR?: WeddingInviteWhereInput[]
    NOT?: WeddingInviteWhereInput | WeddingInviteWhereInput[]
    id?: StringFilter<"WeddingInvite"> | string
    weddingId?: StringFilter<"WeddingInvite"> | string
    token?: StringFilter<"WeddingInvite"> | string
    expiresAt?: DateTimeFilter<"WeddingInvite"> | Date | string
    acceptedAt?: DateTimeNullableFilter<"WeddingInvite"> | Date | string | null
    acceptedBy?: StringNullableFilter<"WeddingInvite"> | string | null
    createdAt?: DateTimeFilter<"WeddingInvite"> | Date | string
    wedding?: XOR<WeddingScalarRelationFilter, WeddingWhereInput>
  }

  export type WeddingInviteOrderByWithRelationInput = {
    id?: SortOrder
    weddingId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    acceptedAt?: SortOrderInput | SortOrder
    acceptedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    wedding?: WeddingOrderByWithRelationInput
  }

  export type WeddingInviteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: WeddingInviteWhereInput | WeddingInviteWhereInput[]
    OR?: WeddingInviteWhereInput[]
    NOT?: WeddingInviteWhereInput | WeddingInviteWhereInput[]
    weddingId?: StringFilter<"WeddingInvite"> | string
    expiresAt?: DateTimeFilter<"WeddingInvite"> | Date | string
    acceptedAt?: DateTimeNullableFilter<"WeddingInvite"> | Date | string | null
    acceptedBy?: StringNullableFilter<"WeddingInvite"> | string | null
    createdAt?: DateTimeFilter<"WeddingInvite"> | Date | string
    wedding?: XOR<WeddingScalarRelationFilter, WeddingWhereInput>
  }, "id" | "token">

  export type WeddingInviteOrderByWithAggregationInput = {
    id?: SortOrder
    weddingId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    acceptedAt?: SortOrderInput | SortOrder
    acceptedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: WeddingInviteCountOrderByAggregateInput
    _max?: WeddingInviteMaxOrderByAggregateInput
    _min?: WeddingInviteMinOrderByAggregateInput
  }

  export type WeddingInviteScalarWhereWithAggregatesInput = {
    AND?: WeddingInviteScalarWhereWithAggregatesInput | WeddingInviteScalarWhereWithAggregatesInput[]
    OR?: WeddingInviteScalarWhereWithAggregatesInput[]
    NOT?: WeddingInviteScalarWhereWithAggregatesInput | WeddingInviteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WeddingInvite"> | string
    weddingId?: StringWithAggregatesFilter<"WeddingInvite"> | string
    token?: StringWithAggregatesFilter<"WeddingInvite"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"WeddingInvite"> | Date | string
    acceptedAt?: DateTimeNullableWithAggregatesFilter<"WeddingInvite"> | Date | string | null
    acceptedBy?: StringNullableWithAggregatesFilter<"WeddingInvite"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"WeddingInvite"> | Date | string
  }

  export type TaskWhereInput = {
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    id?: StringFilter<"Task"> | string
    weddingId?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    categorySlug?: StringNullableFilter<"Task"> | string | null
    status?: EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus
    dueDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    dueRemindedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    sortOrder?: IntFilter<"Task"> | number
    isCustom?: BoolFilter<"Task"> | boolean
    assignee?: StringNullableFilter<"Task"> | string | null
    wedding?: XOR<WeddingScalarRelationFilter, WeddingWhereInput>
  }

  export type TaskOrderByWithRelationInput = {
    id?: SortOrder
    weddingId?: SortOrder
    title?: SortOrder
    categorySlug?: SortOrderInput | SortOrder
    status?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    dueRemindedAt?: SortOrderInput | SortOrder
    sortOrder?: SortOrder
    isCustom?: SortOrder
    assignee?: SortOrderInput | SortOrder
    wedding?: WeddingOrderByWithRelationInput
  }

  export type TaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    weddingId?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    categorySlug?: StringNullableFilter<"Task"> | string | null
    status?: EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus
    dueDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    dueRemindedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    sortOrder?: IntFilter<"Task"> | number
    isCustom?: BoolFilter<"Task"> | boolean
    assignee?: StringNullableFilter<"Task"> | string | null
    wedding?: XOR<WeddingScalarRelationFilter, WeddingWhereInput>
  }, "id">

  export type TaskOrderByWithAggregationInput = {
    id?: SortOrder
    weddingId?: SortOrder
    title?: SortOrder
    categorySlug?: SortOrderInput | SortOrder
    status?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    dueRemindedAt?: SortOrderInput | SortOrder
    sortOrder?: SortOrder
    isCustom?: SortOrder
    assignee?: SortOrderInput | SortOrder
    _count?: TaskCountOrderByAggregateInput
    _avg?: TaskAvgOrderByAggregateInput
    _max?: TaskMaxOrderByAggregateInput
    _min?: TaskMinOrderByAggregateInput
    _sum?: TaskSumOrderByAggregateInput
  }

  export type TaskScalarWhereWithAggregatesInput = {
    AND?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    OR?: TaskScalarWhereWithAggregatesInput[]
    NOT?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Task"> | string
    weddingId?: StringWithAggregatesFilter<"Task"> | string
    title?: StringWithAggregatesFilter<"Task"> | string
    categorySlug?: StringNullableWithAggregatesFilter<"Task"> | string | null
    status?: EnumTaskStatusWithAggregatesFilter<"Task"> | $Enums.TaskStatus
    dueDate?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
    dueRemindedAt?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
    sortOrder?: IntWithAggregatesFilter<"Task"> | number
    isCustom?: BoolWithAggregatesFilter<"Task"> | boolean
    assignee?: StringNullableWithAggregatesFilter<"Task"> | string | null
  }

  export type GuestWhereInput = {
    AND?: GuestWhereInput | GuestWhereInput[]
    OR?: GuestWhereInput[]
    NOT?: GuestWhereInput | GuestWhereInput[]
    id?: StringFilter<"Guest"> | string
    weddingId?: StringFilter<"Guest"> | string
    name?: StringFilter<"Guest"> | string
    email?: StringNullableFilter<"Guest"> | string | null
    phone?: StringNullableFilter<"Guest"> | string | null
    side?: EnumGuestSideFilter<"Guest"> | $Enums.GuestSide
    rsvpStatus?: EnumRsvpStatusFilter<"Guest"> | $Enums.RsvpStatus
    plusOne?: BoolFilter<"Guest"> | boolean
    plusOneName?: StringNullableFilter<"Guest"> | string | null
    plusOneAttending?: BoolNullableFilter<"Guest"> | boolean | null
    allergies?: StringNullableFilter<"Guest"> | string | null
    tableLabel?: StringNullableFilter<"Guest"> | string | null
    notes?: StringNullableFilter<"Guest"> | string | null
    inviteToken?: StringFilter<"Guest"> | string
    respondedAt?: DateTimeNullableFilter<"Guest"> | Date | string | null
    createdAt?: DateTimeFilter<"Guest"> | Date | string
    wedding?: XOR<WeddingScalarRelationFilter, WeddingWhereInput>
  }

  export type GuestOrderByWithRelationInput = {
    id?: SortOrder
    weddingId?: SortOrder
    name?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    side?: SortOrder
    rsvpStatus?: SortOrder
    plusOne?: SortOrder
    plusOneName?: SortOrderInput | SortOrder
    plusOneAttending?: SortOrderInput | SortOrder
    allergies?: SortOrderInput | SortOrder
    tableLabel?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    inviteToken?: SortOrder
    respondedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    wedding?: WeddingOrderByWithRelationInput
  }

  export type GuestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    inviteToken?: string
    AND?: GuestWhereInput | GuestWhereInput[]
    OR?: GuestWhereInput[]
    NOT?: GuestWhereInput | GuestWhereInput[]
    weddingId?: StringFilter<"Guest"> | string
    name?: StringFilter<"Guest"> | string
    email?: StringNullableFilter<"Guest"> | string | null
    phone?: StringNullableFilter<"Guest"> | string | null
    side?: EnumGuestSideFilter<"Guest"> | $Enums.GuestSide
    rsvpStatus?: EnumRsvpStatusFilter<"Guest"> | $Enums.RsvpStatus
    plusOne?: BoolFilter<"Guest"> | boolean
    plusOneName?: StringNullableFilter<"Guest"> | string | null
    plusOneAttending?: BoolNullableFilter<"Guest"> | boolean | null
    allergies?: StringNullableFilter<"Guest"> | string | null
    tableLabel?: StringNullableFilter<"Guest"> | string | null
    notes?: StringNullableFilter<"Guest"> | string | null
    respondedAt?: DateTimeNullableFilter<"Guest"> | Date | string | null
    createdAt?: DateTimeFilter<"Guest"> | Date | string
    wedding?: XOR<WeddingScalarRelationFilter, WeddingWhereInput>
  }, "id" | "inviteToken">

  export type GuestOrderByWithAggregationInput = {
    id?: SortOrder
    weddingId?: SortOrder
    name?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    side?: SortOrder
    rsvpStatus?: SortOrder
    plusOne?: SortOrder
    plusOneName?: SortOrderInput | SortOrder
    plusOneAttending?: SortOrderInput | SortOrder
    allergies?: SortOrderInput | SortOrder
    tableLabel?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    inviteToken?: SortOrder
    respondedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: GuestCountOrderByAggregateInput
    _max?: GuestMaxOrderByAggregateInput
    _min?: GuestMinOrderByAggregateInput
  }

  export type GuestScalarWhereWithAggregatesInput = {
    AND?: GuestScalarWhereWithAggregatesInput | GuestScalarWhereWithAggregatesInput[]
    OR?: GuestScalarWhereWithAggregatesInput[]
    NOT?: GuestScalarWhereWithAggregatesInput | GuestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Guest"> | string
    weddingId?: StringWithAggregatesFilter<"Guest"> | string
    name?: StringWithAggregatesFilter<"Guest"> | string
    email?: StringNullableWithAggregatesFilter<"Guest"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Guest"> | string | null
    side?: EnumGuestSideWithAggregatesFilter<"Guest"> | $Enums.GuestSide
    rsvpStatus?: EnumRsvpStatusWithAggregatesFilter<"Guest"> | $Enums.RsvpStatus
    plusOne?: BoolWithAggregatesFilter<"Guest"> | boolean
    plusOneName?: StringNullableWithAggregatesFilter<"Guest"> | string | null
    plusOneAttending?: BoolNullableWithAggregatesFilter<"Guest"> | boolean | null
    allergies?: StringNullableWithAggregatesFilter<"Guest"> | string | null
    tableLabel?: StringNullableWithAggregatesFilter<"Guest"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Guest"> | string | null
    inviteToken?: StringWithAggregatesFilter<"Guest"> | string
    respondedAt?: DateTimeNullableWithAggregatesFilter<"Guest"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Guest"> | Date | string
  }

  export type BudgetItemWhereInput = {
    AND?: BudgetItemWhereInput | BudgetItemWhereInput[]
    OR?: BudgetItemWhereInput[]
    NOT?: BudgetItemWhereInput | BudgetItemWhereInput[]
    id?: StringFilter<"BudgetItem"> | string
    weddingId?: StringFilter<"BudgetItem"> | string
    category?: StringFilter<"BudgetItem"> | string
    title?: StringFilter<"BudgetItem"> | string
    estimated?: IntFilter<"BudgetItem"> | number
    actual?: IntFilter<"BudgetItem"> | number
    paid?: BoolFilter<"BudgetItem"> | boolean
    notes?: StringNullableFilter<"BudgetItem"> | string | null
    externalVendorId?: StringNullableFilter<"BudgetItem"> | string | null
    createdAt?: DateTimeFilter<"BudgetItem"> | Date | string
    wedding?: XOR<WeddingScalarRelationFilter, WeddingWhereInput>
    externalVendor?: XOR<ExternalVendorNullableScalarRelationFilter, ExternalVendorWhereInput> | null
  }

  export type BudgetItemOrderByWithRelationInput = {
    id?: SortOrder
    weddingId?: SortOrder
    category?: SortOrder
    title?: SortOrder
    estimated?: SortOrder
    actual?: SortOrder
    paid?: SortOrder
    notes?: SortOrderInput | SortOrder
    externalVendorId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    wedding?: WeddingOrderByWithRelationInput
    externalVendor?: ExternalVendorOrderByWithRelationInput
  }

  export type BudgetItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    externalVendorId?: string
    AND?: BudgetItemWhereInput | BudgetItemWhereInput[]
    OR?: BudgetItemWhereInput[]
    NOT?: BudgetItemWhereInput | BudgetItemWhereInput[]
    weddingId?: StringFilter<"BudgetItem"> | string
    category?: StringFilter<"BudgetItem"> | string
    title?: StringFilter<"BudgetItem"> | string
    estimated?: IntFilter<"BudgetItem"> | number
    actual?: IntFilter<"BudgetItem"> | number
    paid?: BoolFilter<"BudgetItem"> | boolean
    notes?: StringNullableFilter<"BudgetItem"> | string | null
    createdAt?: DateTimeFilter<"BudgetItem"> | Date | string
    wedding?: XOR<WeddingScalarRelationFilter, WeddingWhereInput>
    externalVendor?: XOR<ExternalVendorNullableScalarRelationFilter, ExternalVendorWhereInput> | null
  }, "id" | "externalVendorId">

  export type BudgetItemOrderByWithAggregationInput = {
    id?: SortOrder
    weddingId?: SortOrder
    category?: SortOrder
    title?: SortOrder
    estimated?: SortOrder
    actual?: SortOrder
    paid?: SortOrder
    notes?: SortOrderInput | SortOrder
    externalVendorId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: BudgetItemCountOrderByAggregateInput
    _avg?: BudgetItemAvgOrderByAggregateInput
    _max?: BudgetItemMaxOrderByAggregateInput
    _min?: BudgetItemMinOrderByAggregateInput
    _sum?: BudgetItemSumOrderByAggregateInput
  }

  export type BudgetItemScalarWhereWithAggregatesInput = {
    AND?: BudgetItemScalarWhereWithAggregatesInput | BudgetItemScalarWhereWithAggregatesInput[]
    OR?: BudgetItemScalarWhereWithAggregatesInput[]
    NOT?: BudgetItemScalarWhereWithAggregatesInput | BudgetItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BudgetItem"> | string
    weddingId?: StringWithAggregatesFilter<"BudgetItem"> | string
    category?: StringWithAggregatesFilter<"BudgetItem"> | string
    title?: StringWithAggregatesFilter<"BudgetItem"> | string
    estimated?: IntWithAggregatesFilter<"BudgetItem"> | number
    actual?: IntWithAggregatesFilter<"BudgetItem"> | number
    paid?: BoolWithAggregatesFilter<"BudgetItem"> | boolean
    notes?: StringNullableWithAggregatesFilter<"BudgetItem"> | string | null
    externalVendorId?: StringNullableWithAggregatesFilter<"BudgetItem"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"BudgetItem"> | Date | string
  }

  export type ContentTopicWhereInput = {
    AND?: ContentTopicWhereInput | ContentTopicWhereInput[]
    OR?: ContentTopicWhereInput[]
    NOT?: ContentTopicWhereInput | ContentTopicWhereInput[]
    id?: StringFilter<"ContentTopic"> | string
    name?: StringFilter<"ContentTopic"> | string
    slug?: StringFilter<"ContentTopic"> | string
    description?: StringFilter<"ContentTopic"> | string
    icon?: StringFilter<"ContentTopic"> | string
    coverUrl?: StringNullableFilter<"ContentTopic"> | string | null
    sortOrder?: IntFilter<"ContentTopic"> | number
    posts?: ContentPostListRelationFilter
  }

  export type ContentTopicOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    icon?: SortOrder
    coverUrl?: SortOrderInput | SortOrder
    sortOrder?: SortOrder
    posts?: ContentPostOrderByRelationAggregateInput
  }

  export type ContentTopicWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: ContentTopicWhereInput | ContentTopicWhereInput[]
    OR?: ContentTopicWhereInput[]
    NOT?: ContentTopicWhereInput | ContentTopicWhereInput[]
    name?: StringFilter<"ContentTopic"> | string
    description?: StringFilter<"ContentTopic"> | string
    icon?: StringFilter<"ContentTopic"> | string
    coverUrl?: StringNullableFilter<"ContentTopic"> | string | null
    sortOrder?: IntFilter<"ContentTopic"> | number
    posts?: ContentPostListRelationFilter
  }, "id" | "slug">

  export type ContentTopicOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    icon?: SortOrder
    coverUrl?: SortOrderInput | SortOrder
    sortOrder?: SortOrder
    _count?: ContentTopicCountOrderByAggregateInput
    _avg?: ContentTopicAvgOrderByAggregateInput
    _max?: ContentTopicMaxOrderByAggregateInput
    _min?: ContentTopicMinOrderByAggregateInput
    _sum?: ContentTopicSumOrderByAggregateInput
  }

  export type ContentTopicScalarWhereWithAggregatesInput = {
    AND?: ContentTopicScalarWhereWithAggregatesInput | ContentTopicScalarWhereWithAggregatesInput[]
    OR?: ContentTopicScalarWhereWithAggregatesInput[]
    NOT?: ContentTopicScalarWhereWithAggregatesInput | ContentTopicScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ContentTopic"> | string
    name?: StringWithAggregatesFilter<"ContentTopic"> | string
    slug?: StringWithAggregatesFilter<"ContentTopic"> | string
    description?: StringWithAggregatesFilter<"ContentTopic"> | string
    icon?: StringWithAggregatesFilter<"ContentTopic"> | string
    coverUrl?: StringNullableWithAggregatesFilter<"ContentTopic"> | string | null
    sortOrder?: IntWithAggregatesFilter<"ContentTopic"> | number
  }

  export type ContentPostWhereInput = {
    AND?: ContentPostWhereInput | ContentPostWhereInput[]
    OR?: ContentPostWhereInput[]
    NOT?: ContentPostWhereInput | ContentPostWhereInput[]
    id?: StringFilter<"ContentPost"> | string
    title?: StringFilter<"ContentPost"> | string
    slug?: StringFilter<"ContentPost"> | string
    excerpt?: StringFilter<"ContentPost"> | string
    coverUrl?: StringNullableFilter<"ContentPost"> | string | null
    kind?: EnumContentKindFilter<"ContentPost"> | $Enums.ContentKind
    status?: EnumContentStatusFilter<"ContentPost"> | $Enums.ContentStatus
    body?: JsonFilter<"ContentPost">
    seoTitle?: StringFilter<"ContentPost"> | string
    seoDescription?: StringFilter<"ContentPost"> | string
    ogImageUrl?: StringNullableFilter<"ContentPost"> | string | null
    city?: StringNullableFilter<"ContentPost"> | string | null
    featured?: BoolFilter<"ContentPost"> | boolean
    topicId?: StringFilter<"ContentPost"> | string
    authorId?: StringNullableFilter<"ContentPost"> | string | null
    publishedAt?: DateTimeNullableFilter<"ContentPost"> | Date | string | null
    createdAt?: DateTimeFilter<"ContentPost"> | Date | string
    updatedAt?: DateTimeFilter<"ContentPost"> | Date | string
    topic?: XOR<ContentTopicScalarRelationFilter, ContentTopicWhereInput>
    author?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type ContentPostOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    excerpt?: SortOrder
    coverUrl?: SortOrderInput | SortOrder
    kind?: SortOrder
    status?: SortOrder
    body?: SortOrder
    seoTitle?: SortOrder
    seoDescription?: SortOrder
    ogImageUrl?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    featured?: SortOrder
    topicId?: SortOrder
    authorId?: SortOrderInput | SortOrder
    publishedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    topic?: ContentTopicOrderByWithRelationInput
    author?: UserOrderByWithRelationInput
  }

  export type ContentPostWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: ContentPostWhereInput | ContentPostWhereInput[]
    OR?: ContentPostWhereInput[]
    NOT?: ContentPostWhereInput | ContentPostWhereInput[]
    title?: StringFilter<"ContentPost"> | string
    excerpt?: StringFilter<"ContentPost"> | string
    coverUrl?: StringNullableFilter<"ContentPost"> | string | null
    kind?: EnumContentKindFilter<"ContentPost"> | $Enums.ContentKind
    status?: EnumContentStatusFilter<"ContentPost"> | $Enums.ContentStatus
    body?: JsonFilter<"ContentPost">
    seoTitle?: StringFilter<"ContentPost"> | string
    seoDescription?: StringFilter<"ContentPost"> | string
    ogImageUrl?: StringNullableFilter<"ContentPost"> | string | null
    city?: StringNullableFilter<"ContentPost"> | string | null
    featured?: BoolFilter<"ContentPost"> | boolean
    topicId?: StringFilter<"ContentPost"> | string
    authorId?: StringNullableFilter<"ContentPost"> | string | null
    publishedAt?: DateTimeNullableFilter<"ContentPost"> | Date | string | null
    createdAt?: DateTimeFilter<"ContentPost"> | Date | string
    updatedAt?: DateTimeFilter<"ContentPost"> | Date | string
    topic?: XOR<ContentTopicScalarRelationFilter, ContentTopicWhereInput>
    author?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "slug">

  export type ContentPostOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    excerpt?: SortOrder
    coverUrl?: SortOrderInput | SortOrder
    kind?: SortOrder
    status?: SortOrder
    body?: SortOrder
    seoTitle?: SortOrder
    seoDescription?: SortOrder
    ogImageUrl?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    featured?: SortOrder
    topicId?: SortOrder
    authorId?: SortOrderInput | SortOrder
    publishedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ContentPostCountOrderByAggregateInput
    _max?: ContentPostMaxOrderByAggregateInput
    _min?: ContentPostMinOrderByAggregateInput
  }

  export type ContentPostScalarWhereWithAggregatesInput = {
    AND?: ContentPostScalarWhereWithAggregatesInput | ContentPostScalarWhereWithAggregatesInput[]
    OR?: ContentPostScalarWhereWithAggregatesInput[]
    NOT?: ContentPostScalarWhereWithAggregatesInput | ContentPostScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ContentPost"> | string
    title?: StringWithAggregatesFilter<"ContentPost"> | string
    slug?: StringWithAggregatesFilter<"ContentPost"> | string
    excerpt?: StringWithAggregatesFilter<"ContentPost"> | string
    coverUrl?: StringNullableWithAggregatesFilter<"ContentPost"> | string | null
    kind?: EnumContentKindWithAggregatesFilter<"ContentPost"> | $Enums.ContentKind
    status?: EnumContentStatusWithAggregatesFilter<"ContentPost"> | $Enums.ContentStatus
    body?: JsonWithAggregatesFilter<"ContentPost">
    seoTitle?: StringWithAggregatesFilter<"ContentPost"> | string
    seoDescription?: StringWithAggregatesFilter<"ContentPost"> | string
    ogImageUrl?: StringNullableWithAggregatesFilter<"ContentPost"> | string | null
    city?: StringNullableWithAggregatesFilter<"ContentPost"> | string | null
    featured?: BoolWithAggregatesFilter<"ContentPost"> | boolean
    topicId?: StringWithAggregatesFilter<"ContentPost"> | string
    authorId?: StringNullableWithAggregatesFilter<"ContentPost"> | string | null
    publishedAt?: DateTimeNullableWithAggregatesFilter<"ContentPost"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ContentPost"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ContentPost"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    password: string
    name: string
    role?: $Enums.Role
    blocked?: boolean
    refreshTokenHash?: string | null
    createdAt?: Date | string
    wedding?: WeddingCreateNestedOneWithoutUserInput
    weddingMember?: WeddingMemberCreateNestedOneWithoutUserInput
    externalVendors?: ExternalVendorCreateNestedManyWithoutUserInput
    contentPosts?: ContentPostCreateNestedManyWithoutAuthorInput
    pushDevices?: PushDeviceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    name: string
    role?: $Enums.Role
    blocked?: boolean
    refreshTokenHash?: string | null
    createdAt?: Date | string
    wedding?: WeddingUncheckedCreateNestedOneWithoutUserInput
    weddingMember?: WeddingMemberUncheckedCreateNestedOneWithoutUserInput
    externalVendors?: ExternalVendorUncheckedCreateNestedManyWithoutUserInput
    contentPosts?: ContentPostUncheckedCreateNestedManyWithoutAuthorInput
    pushDevices?: PushDeviceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    blocked?: BoolFieldUpdateOperationsInput | boolean
    refreshTokenHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wedding?: WeddingUpdateOneWithoutUserNestedInput
    weddingMember?: WeddingMemberUpdateOneWithoutUserNestedInput
    externalVendors?: ExternalVendorUpdateManyWithoutUserNestedInput
    contentPosts?: ContentPostUpdateManyWithoutAuthorNestedInput
    pushDevices?: PushDeviceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    blocked?: BoolFieldUpdateOperationsInput | boolean
    refreshTokenHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wedding?: WeddingUncheckedUpdateOneWithoutUserNestedInput
    weddingMember?: WeddingMemberUncheckedUpdateOneWithoutUserNestedInput
    externalVendors?: ExternalVendorUncheckedUpdateManyWithoutUserNestedInput
    contentPosts?: ContentPostUncheckedUpdateManyWithoutAuthorNestedInput
    pushDevices?: PushDeviceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    password: string
    name: string
    role?: $Enums.Role
    blocked?: boolean
    refreshTokenHash?: string | null
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    blocked?: BoolFieldUpdateOperationsInput | boolean
    refreshTokenHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    blocked?: BoolFieldUpdateOperationsInput | boolean
    refreshTokenHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushDeviceCreateInput = {
    id?: string
    token: string
    platform?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPushDevicesInput
  }

  export type PushDeviceUncheckedCreateInput = {
    id?: string
    userId: string
    token: string
    platform?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PushDeviceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPushDevicesNestedInput
  }

  export type PushDeviceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushDeviceCreateManyInput = {
    id?: string
    userId: string
    token: string
    platform?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PushDeviceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushDeviceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExternalVendorCreateInput = {
    id?: string
    name: string
    category: string
    city: string
    phone?: string | null
    website?: string | null
    quotedPrice?: number | null
    notes?: string | null
    stage?: $Enums.VendorPipelineStage
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutExternalVendorsInput
    budgetItem?: BudgetItemCreateNestedOneWithoutExternalVendorInput
  }

  export type ExternalVendorUncheckedCreateInput = {
    id?: string
    userId: string
    name: string
    category: string
    city: string
    phone?: string | null
    website?: string | null
    quotedPrice?: number | null
    notes?: string | null
    stage?: $Enums.VendorPipelineStage
    createdAt?: Date | string
    updatedAt?: Date | string
    budgetItem?: BudgetItemUncheckedCreateNestedOneWithoutExternalVendorInput
  }

  export type ExternalVendorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    quotedPrice?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    stage?: EnumVendorPipelineStageFieldUpdateOperationsInput | $Enums.VendorPipelineStage
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutExternalVendorsNestedInput
    budgetItem?: BudgetItemUpdateOneWithoutExternalVendorNestedInput
  }

  export type ExternalVendorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    quotedPrice?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    stage?: EnumVendorPipelineStageFieldUpdateOperationsInput | $Enums.VendorPipelineStage
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    budgetItem?: BudgetItemUncheckedUpdateOneWithoutExternalVendorNestedInput
  }

  export type ExternalVendorCreateManyInput = {
    id?: string
    userId: string
    name: string
    category: string
    city: string
    phone?: string | null
    website?: string | null
    quotedPrice?: number | null
    notes?: string | null
    stage?: $Enums.VendorPipelineStage
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExternalVendorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    quotedPrice?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    stage?: EnumVendorPipelineStageFieldUpdateOperationsInput | $Enums.VendorPipelineStage
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExternalVendorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    quotedPrice?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    stage?: EnumVendorPipelineStageFieldUpdateOperationsInput | $Enums.VendorPipelineStage
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingCreateInput = {
    id?: string
    date: Date | string
    city: string
    guests: number
    budget: number
    partnerOneName?: string
    partnerTwoName?: string
    couplePhotoUrl?: string | null
    planningStage?: string
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutWeddingInput
    members?: WeddingMemberCreateNestedManyWithoutWeddingInput
    invites?: WeddingInviteCreateNestedManyWithoutWeddingInput
    tasks?: TaskCreateNestedManyWithoutWeddingInput
    guestList?: GuestCreateNestedManyWithoutWeddingInput
    budgetItems?: BudgetItemCreateNestedManyWithoutWeddingInput
    website?: WeddingWebsiteCreateNestedOneWithoutWeddingInput
    invitation?: WeddingInvitationCreateNestedOneWithoutWeddingInput
  }

  export type WeddingUncheckedCreateInput = {
    id?: string
    userId: string
    date: Date | string
    city: string
    guests: number
    budget: number
    partnerOneName?: string
    partnerTwoName?: string
    couplePhotoUrl?: string | null
    planningStage?: string
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    members?: WeddingMemberUncheckedCreateNestedManyWithoutWeddingInput
    invites?: WeddingInviteUncheckedCreateNestedManyWithoutWeddingInput
    tasks?: TaskUncheckedCreateNestedManyWithoutWeddingInput
    guestList?: GuestUncheckedCreateNestedManyWithoutWeddingInput
    budgetItems?: BudgetItemUncheckedCreateNestedManyWithoutWeddingInput
    website?: WeddingWebsiteUncheckedCreateNestedOneWithoutWeddingInput
    invitation?: WeddingInvitationUncheckedCreateNestedOneWithoutWeddingInput
  }

  export type WeddingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    guests?: IntFieldUpdateOperationsInput | number
    budget?: IntFieldUpdateOperationsInput | number
    partnerOneName?: StringFieldUpdateOperationsInput | string
    partnerTwoName?: StringFieldUpdateOperationsInput | string
    couplePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    planningStage?: StringFieldUpdateOperationsInput | string
    cityUndecided?: BoolFieldUpdateOperationsInput | boolean
    guestsUndecided?: BoolFieldUpdateOperationsInput | boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutWeddingNestedInput
    members?: WeddingMemberUpdateManyWithoutWeddingNestedInput
    invites?: WeddingInviteUpdateManyWithoutWeddingNestedInput
    tasks?: TaskUpdateManyWithoutWeddingNestedInput
    guestList?: GuestUpdateManyWithoutWeddingNestedInput
    budgetItems?: BudgetItemUpdateManyWithoutWeddingNestedInput
    website?: WeddingWebsiteUpdateOneWithoutWeddingNestedInput
    invitation?: WeddingInvitationUpdateOneWithoutWeddingNestedInput
  }

  export type WeddingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    guests?: IntFieldUpdateOperationsInput | number
    budget?: IntFieldUpdateOperationsInput | number
    partnerOneName?: StringFieldUpdateOperationsInput | string
    partnerTwoName?: StringFieldUpdateOperationsInput | string
    couplePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    planningStage?: StringFieldUpdateOperationsInput | string
    cityUndecided?: BoolFieldUpdateOperationsInput | boolean
    guestsUndecided?: BoolFieldUpdateOperationsInput | boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    members?: WeddingMemberUncheckedUpdateManyWithoutWeddingNestedInput
    invites?: WeddingInviteUncheckedUpdateManyWithoutWeddingNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutWeddingNestedInput
    guestList?: GuestUncheckedUpdateManyWithoutWeddingNestedInput
    budgetItems?: BudgetItemUncheckedUpdateManyWithoutWeddingNestedInput
    website?: WeddingWebsiteUncheckedUpdateOneWithoutWeddingNestedInput
    invitation?: WeddingInvitationUncheckedUpdateOneWithoutWeddingNestedInput
  }

  export type WeddingCreateManyInput = {
    id?: string
    userId: string
    date: Date | string
    city: string
    guests: number
    budget: number
    partnerOneName?: string
    partnerTwoName?: string
    couplePhotoUrl?: string | null
    planningStage?: string
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
  }

  export type WeddingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    guests?: IntFieldUpdateOperationsInput | number
    budget?: IntFieldUpdateOperationsInput | number
    partnerOneName?: StringFieldUpdateOperationsInput | string
    partnerTwoName?: StringFieldUpdateOperationsInput | string
    couplePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    planningStage?: StringFieldUpdateOperationsInput | string
    cityUndecided?: BoolFieldUpdateOperationsInput | boolean
    guestsUndecided?: BoolFieldUpdateOperationsInput | boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
  }

  export type WeddingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    guests?: IntFieldUpdateOperationsInput | number
    budget?: IntFieldUpdateOperationsInput | number
    partnerOneName?: StringFieldUpdateOperationsInput | string
    partnerTwoName?: StringFieldUpdateOperationsInput | string
    couplePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    planningStage?: StringFieldUpdateOperationsInput | string
    cityUndecided?: BoolFieldUpdateOperationsInput | boolean
    guestsUndecided?: BoolFieldUpdateOperationsInput | boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
  }

  export type WeddingWebsiteCreateInput = {
    id?: string
    slug: string
    templateId?: string
    published?: boolean
    publishedAt?: Date | string | null
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    wedding: WeddingCreateNestedOneWithoutWebsiteInput
  }

  export type WeddingWebsiteUncheckedCreateInput = {
    id?: string
    weddingId: string
    slug: string
    templateId?: string
    published?: boolean
    publishedAt?: Date | string | null
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WeddingWebsiteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wedding?: WeddingUpdateOneRequiredWithoutWebsiteNestedInput
  }

  export type WeddingWebsiteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weddingId?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingWebsiteCreateManyInput = {
    id?: string
    weddingId: string
    slug: string
    templateId?: string
    published?: boolean
    publishedAt?: Date | string | null
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WeddingWebsiteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingWebsiteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    weddingId?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingInvitationCreateInput = {
    id?: string
    templateId?: string
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    wedding: WeddingCreateNestedOneWithoutInvitationInput
  }

  export type WeddingInvitationUncheckedCreateInput = {
    id?: string
    weddingId: string
    templateId?: string
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WeddingInvitationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wedding?: WeddingUpdateOneRequiredWithoutInvitationNestedInput
  }

  export type WeddingInvitationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weddingId?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingInvitationCreateManyInput = {
    id?: string
    weddingId: string
    templateId?: string
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WeddingInvitationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingInvitationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    weddingId?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingMemberCreateInput = {
    id?: string
    role?: $Enums.WeddingMemberRole
    createdAt?: Date | string
    wedding: WeddingCreateNestedOneWithoutMembersInput
    user: UserCreateNestedOneWithoutWeddingMemberInput
  }

  export type WeddingMemberUncheckedCreateInput = {
    id?: string
    weddingId: string
    userId: string
    role?: $Enums.WeddingMemberRole
    createdAt?: Date | string
  }

  export type WeddingMemberUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumWeddingMemberRoleFieldUpdateOperationsInput | $Enums.WeddingMemberRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wedding?: WeddingUpdateOneRequiredWithoutMembersNestedInput
    user?: UserUpdateOneRequiredWithoutWeddingMemberNestedInput
  }

  export type WeddingMemberUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weddingId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: EnumWeddingMemberRoleFieldUpdateOperationsInput | $Enums.WeddingMemberRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingMemberCreateManyInput = {
    id?: string
    weddingId: string
    userId: string
    role?: $Enums.WeddingMemberRole
    createdAt?: Date | string
  }

  export type WeddingMemberUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumWeddingMemberRoleFieldUpdateOperationsInput | $Enums.WeddingMemberRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingMemberUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    weddingId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: EnumWeddingMemberRoleFieldUpdateOperationsInput | $Enums.WeddingMemberRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingInviteCreateInput = {
    id?: string
    token?: string
    expiresAt: Date | string
    acceptedAt?: Date | string | null
    acceptedBy?: string | null
    createdAt?: Date | string
    wedding: WeddingCreateNestedOneWithoutInvitesInput
  }

  export type WeddingInviteUncheckedCreateInput = {
    id?: string
    weddingId: string
    token?: string
    expiresAt: Date | string
    acceptedAt?: Date | string | null
    acceptedBy?: string | null
    createdAt?: Date | string
  }

  export type WeddingInviteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acceptedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acceptedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wedding?: WeddingUpdateOneRequiredWithoutInvitesNestedInput
  }

  export type WeddingInviteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weddingId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acceptedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acceptedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingInviteCreateManyInput = {
    id?: string
    weddingId: string
    token?: string
    expiresAt: Date | string
    acceptedAt?: Date | string | null
    acceptedBy?: string | null
    createdAt?: Date | string
  }

  export type WeddingInviteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acceptedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acceptedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingInviteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    weddingId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acceptedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acceptedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskCreateInput = {
    id?: string
    title: string
    categorySlug?: string | null
    status?: $Enums.TaskStatus
    dueDate?: Date | string | null
    dueRemindedAt?: Date | string | null
    sortOrder?: number
    isCustom?: boolean
    assignee?: string | null
    wedding: WeddingCreateNestedOneWithoutTasksInput
  }

  export type TaskUncheckedCreateInput = {
    id?: string
    weddingId: string
    title: string
    categorySlug?: string | null
    status?: $Enums.TaskStatus
    dueDate?: Date | string | null
    dueRemindedAt?: Date | string | null
    sortOrder?: number
    isCustom?: boolean
    assignee?: string | null
  }

  export type TaskUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    categorySlug?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueRemindedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isCustom?: BoolFieldUpdateOperationsInput | boolean
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
    wedding?: WeddingUpdateOneRequiredWithoutTasksNestedInput
  }

  export type TaskUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weddingId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    categorySlug?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueRemindedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isCustom?: BoolFieldUpdateOperationsInput | boolean
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TaskCreateManyInput = {
    id?: string
    weddingId: string
    title: string
    categorySlug?: string | null
    status?: $Enums.TaskStatus
    dueDate?: Date | string | null
    dueRemindedAt?: Date | string | null
    sortOrder?: number
    isCustom?: boolean
    assignee?: string | null
  }

  export type TaskUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    categorySlug?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueRemindedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isCustom?: BoolFieldUpdateOperationsInput | boolean
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TaskUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    weddingId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    categorySlug?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueRemindedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isCustom?: BoolFieldUpdateOperationsInput | boolean
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GuestCreateInput = {
    id?: string
    name: string
    email?: string | null
    phone?: string | null
    side?: $Enums.GuestSide
    rsvpStatus?: $Enums.RsvpStatus
    plusOne?: boolean
    plusOneName?: string | null
    plusOneAttending?: boolean | null
    allergies?: string | null
    tableLabel?: string | null
    notes?: string | null
    inviteToken?: string
    respondedAt?: Date | string | null
    createdAt?: Date | string
    wedding: WeddingCreateNestedOneWithoutGuestListInput
  }

  export type GuestUncheckedCreateInput = {
    id?: string
    weddingId: string
    name: string
    email?: string | null
    phone?: string | null
    side?: $Enums.GuestSide
    rsvpStatus?: $Enums.RsvpStatus
    plusOne?: boolean
    plusOneName?: string | null
    plusOneAttending?: boolean | null
    allergies?: string | null
    tableLabel?: string | null
    notes?: string | null
    inviteToken?: string
    respondedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type GuestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    side?: EnumGuestSideFieldUpdateOperationsInput | $Enums.GuestSide
    rsvpStatus?: EnumRsvpStatusFieldUpdateOperationsInput | $Enums.RsvpStatus
    plusOne?: BoolFieldUpdateOperationsInput | boolean
    plusOneName?: NullableStringFieldUpdateOperationsInput | string | null
    plusOneAttending?: NullableBoolFieldUpdateOperationsInput | boolean | null
    allergies?: NullableStringFieldUpdateOperationsInput | string | null
    tableLabel?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    inviteToken?: StringFieldUpdateOperationsInput | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wedding?: WeddingUpdateOneRequiredWithoutGuestListNestedInput
  }

  export type GuestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weddingId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    side?: EnumGuestSideFieldUpdateOperationsInput | $Enums.GuestSide
    rsvpStatus?: EnumRsvpStatusFieldUpdateOperationsInput | $Enums.RsvpStatus
    plusOne?: BoolFieldUpdateOperationsInput | boolean
    plusOneName?: NullableStringFieldUpdateOperationsInput | string | null
    plusOneAttending?: NullableBoolFieldUpdateOperationsInput | boolean | null
    allergies?: NullableStringFieldUpdateOperationsInput | string | null
    tableLabel?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    inviteToken?: StringFieldUpdateOperationsInput | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestCreateManyInput = {
    id?: string
    weddingId: string
    name: string
    email?: string | null
    phone?: string | null
    side?: $Enums.GuestSide
    rsvpStatus?: $Enums.RsvpStatus
    plusOne?: boolean
    plusOneName?: string | null
    plusOneAttending?: boolean | null
    allergies?: string | null
    tableLabel?: string | null
    notes?: string | null
    inviteToken?: string
    respondedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type GuestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    side?: EnumGuestSideFieldUpdateOperationsInput | $Enums.GuestSide
    rsvpStatus?: EnumRsvpStatusFieldUpdateOperationsInput | $Enums.RsvpStatus
    plusOne?: BoolFieldUpdateOperationsInput | boolean
    plusOneName?: NullableStringFieldUpdateOperationsInput | string | null
    plusOneAttending?: NullableBoolFieldUpdateOperationsInput | boolean | null
    allergies?: NullableStringFieldUpdateOperationsInput | string | null
    tableLabel?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    inviteToken?: StringFieldUpdateOperationsInput | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    weddingId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    side?: EnumGuestSideFieldUpdateOperationsInput | $Enums.GuestSide
    rsvpStatus?: EnumRsvpStatusFieldUpdateOperationsInput | $Enums.RsvpStatus
    plusOne?: BoolFieldUpdateOperationsInput | boolean
    plusOneName?: NullableStringFieldUpdateOperationsInput | string | null
    plusOneAttending?: NullableBoolFieldUpdateOperationsInput | boolean | null
    allergies?: NullableStringFieldUpdateOperationsInput | string | null
    tableLabel?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    inviteToken?: StringFieldUpdateOperationsInput | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BudgetItemCreateInput = {
    id?: string
    category: string
    title: string
    estimated?: number
    actual?: number
    paid?: boolean
    notes?: string | null
    createdAt?: Date | string
    wedding: WeddingCreateNestedOneWithoutBudgetItemsInput
    externalVendor?: ExternalVendorCreateNestedOneWithoutBudgetItemInput
  }

  export type BudgetItemUncheckedCreateInput = {
    id?: string
    weddingId: string
    category: string
    title: string
    estimated?: number
    actual?: number
    paid?: boolean
    notes?: string | null
    externalVendorId?: string | null
    createdAt?: Date | string
  }

  export type BudgetItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    estimated?: IntFieldUpdateOperationsInput | number
    actual?: IntFieldUpdateOperationsInput | number
    paid?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wedding?: WeddingUpdateOneRequiredWithoutBudgetItemsNestedInput
    externalVendor?: ExternalVendorUpdateOneWithoutBudgetItemNestedInput
  }

  export type BudgetItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weddingId?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    estimated?: IntFieldUpdateOperationsInput | number
    actual?: IntFieldUpdateOperationsInput | number
    paid?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    externalVendorId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BudgetItemCreateManyInput = {
    id?: string
    weddingId: string
    category: string
    title: string
    estimated?: number
    actual?: number
    paid?: boolean
    notes?: string | null
    externalVendorId?: string | null
    createdAt?: Date | string
  }

  export type BudgetItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    estimated?: IntFieldUpdateOperationsInput | number
    actual?: IntFieldUpdateOperationsInput | number
    paid?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BudgetItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    weddingId?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    estimated?: IntFieldUpdateOperationsInput | number
    actual?: IntFieldUpdateOperationsInput | number
    paid?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    externalVendorId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContentTopicCreateInput = {
    id?: string
    name: string
    slug: string
    description?: string
    icon?: string
    coverUrl?: string | null
    sortOrder?: number
    posts?: ContentPostCreateNestedManyWithoutTopicInput
  }

  export type ContentTopicUncheckedCreateInput = {
    id?: string
    name: string
    slug: string
    description?: string
    icon?: string
    coverUrl?: string | null
    sortOrder?: number
    posts?: ContentPostUncheckedCreateNestedManyWithoutTopicInput
  }

  export type ContentTopicUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    posts?: ContentPostUpdateManyWithoutTopicNestedInput
  }

  export type ContentTopicUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    posts?: ContentPostUncheckedUpdateManyWithoutTopicNestedInput
  }

  export type ContentTopicCreateManyInput = {
    id?: string
    name: string
    slug: string
    description?: string
    icon?: string
    coverUrl?: string | null
    sortOrder?: number
  }

  export type ContentTopicUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type ContentTopicUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type ContentPostCreateInput = {
    id?: string
    title: string
    slug: string
    excerpt?: string
    coverUrl?: string | null
    kind?: $Enums.ContentKind
    status?: $Enums.ContentStatus
    body?: JsonNullValueInput | InputJsonValue
    seoTitle?: string
    seoDescription?: string
    ogImageUrl?: string | null
    city?: string | null
    featured?: boolean
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    topic: ContentTopicCreateNestedOneWithoutPostsInput
    author?: UserCreateNestedOneWithoutContentPostsInput
  }

  export type ContentPostUncheckedCreateInput = {
    id?: string
    title: string
    slug: string
    excerpt?: string
    coverUrl?: string | null
    kind?: $Enums.ContentKind
    status?: $Enums.ContentStatus
    body?: JsonNullValueInput | InputJsonValue
    seoTitle?: string
    seoDescription?: string
    ogImageUrl?: string | null
    city?: string | null
    featured?: boolean
    topicId: string
    authorId?: string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContentPostUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    excerpt?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: EnumContentKindFieldUpdateOperationsInput | $Enums.ContentKind
    status?: EnumContentStatusFieldUpdateOperationsInput | $Enums.ContentStatus
    body?: JsonNullValueInput | InputJsonValue
    seoTitle?: StringFieldUpdateOperationsInput | string
    seoDescription?: StringFieldUpdateOperationsInput | string
    ogImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    featured?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    topic?: ContentTopicUpdateOneRequiredWithoutPostsNestedInput
    author?: UserUpdateOneWithoutContentPostsNestedInput
  }

  export type ContentPostUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    excerpt?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: EnumContentKindFieldUpdateOperationsInput | $Enums.ContentKind
    status?: EnumContentStatusFieldUpdateOperationsInput | $Enums.ContentStatus
    body?: JsonNullValueInput | InputJsonValue
    seoTitle?: StringFieldUpdateOperationsInput | string
    seoDescription?: StringFieldUpdateOperationsInput | string
    ogImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    featured?: BoolFieldUpdateOperationsInput | boolean
    topicId?: StringFieldUpdateOperationsInput | string
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContentPostCreateManyInput = {
    id?: string
    title: string
    slug: string
    excerpt?: string
    coverUrl?: string | null
    kind?: $Enums.ContentKind
    status?: $Enums.ContentStatus
    body?: JsonNullValueInput | InputJsonValue
    seoTitle?: string
    seoDescription?: string
    ogImageUrl?: string | null
    city?: string | null
    featured?: boolean
    topicId: string
    authorId?: string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContentPostUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    excerpt?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: EnumContentKindFieldUpdateOperationsInput | $Enums.ContentKind
    status?: EnumContentStatusFieldUpdateOperationsInput | $Enums.ContentStatus
    body?: JsonNullValueInput | InputJsonValue
    seoTitle?: StringFieldUpdateOperationsInput | string
    seoDescription?: StringFieldUpdateOperationsInput | string
    ogImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    featured?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContentPostUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    excerpt?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: EnumContentKindFieldUpdateOperationsInput | $Enums.ContentKind
    status?: EnumContentStatusFieldUpdateOperationsInput | $Enums.ContentStatus
    body?: JsonNullValueInput | InputJsonValue
    seoTitle?: StringFieldUpdateOperationsInput | string
    seoDescription?: StringFieldUpdateOperationsInput | string
    ogImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    featured?: BoolFieldUpdateOperationsInput | boolean
    topicId?: StringFieldUpdateOperationsInput | string
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type WeddingNullableScalarRelationFilter = {
    is?: WeddingWhereInput | null
    isNot?: WeddingWhereInput | null
  }

  export type WeddingMemberNullableScalarRelationFilter = {
    is?: WeddingMemberWhereInput | null
    isNot?: WeddingMemberWhereInput | null
  }

  export type ExternalVendorListRelationFilter = {
    every?: ExternalVendorWhereInput
    some?: ExternalVendorWhereInput
    none?: ExternalVendorWhereInput
  }

  export type ContentPostListRelationFilter = {
    every?: ContentPostWhereInput
    some?: ContentPostWhereInput
    none?: ContentPostWhereInput
  }

  export type PushDeviceListRelationFilter = {
    every?: PushDeviceWhereInput
    some?: PushDeviceWhereInput
    none?: PushDeviceWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ExternalVendorOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ContentPostOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PushDeviceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    blocked?: SortOrder
    refreshTokenHash?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    blocked?: SortOrder
    refreshTokenHash?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    blocked?: SortOrder
    refreshTokenHash?: SortOrder
    createdAt?: SortOrder
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

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type PushDeviceCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    platform?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PushDeviceMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    platform?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PushDeviceMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    platform?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type EnumVendorPipelineStageFilter<$PrismaModel = never> = {
    equals?: $Enums.VendorPipelineStage | EnumVendorPipelineStageFieldRefInput<$PrismaModel>
    in?: $Enums.VendorPipelineStage[] | ListEnumVendorPipelineStageFieldRefInput<$PrismaModel>
    notIn?: $Enums.VendorPipelineStage[] | ListEnumVendorPipelineStageFieldRefInput<$PrismaModel>
    not?: NestedEnumVendorPipelineStageFilter<$PrismaModel> | $Enums.VendorPipelineStage
  }

  export type BudgetItemNullableScalarRelationFilter = {
    is?: BudgetItemWhereInput | null
    isNot?: BudgetItemWhereInput | null
  }

  export type ExternalVendorCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    category?: SortOrder
    city?: SortOrder
    phone?: SortOrder
    website?: SortOrder
    quotedPrice?: SortOrder
    notes?: SortOrder
    stage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExternalVendorAvgOrderByAggregateInput = {
    quotedPrice?: SortOrder
  }

  export type ExternalVendorMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    category?: SortOrder
    city?: SortOrder
    phone?: SortOrder
    website?: SortOrder
    quotedPrice?: SortOrder
    notes?: SortOrder
    stage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExternalVendorMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    category?: SortOrder
    city?: SortOrder
    phone?: SortOrder
    website?: SortOrder
    quotedPrice?: SortOrder
    notes?: SortOrder
    stage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExternalVendorSumOrderByAggregateInput = {
    quotedPrice?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumVendorPipelineStageWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VendorPipelineStage | EnumVendorPipelineStageFieldRefInput<$PrismaModel>
    in?: $Enums.VendorPipelineStage[] | ListEnumVendorPipelineStageFieldRefInput<$PrismaModel>
    notIn?: $Enums.VendorPipelineStage[] | ListEnumVendorPipelineStageFieldRefInput<$PrismaModel>
    not?: NestedEnumVendorPipelineStageWithAggregatesFilter<$PrismaModel> | $Enums.VendorPipelineStage
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVendorPipelineStageFilter<$PrismaModel>
    _max?: NestedEnumVendorPipelineStageFilter<$PrismaModel>
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

  export type WeddingMemberListRelationFilter = {
    every?: WeddingMemberWhereInput
    some?: WeddingMemberWhereInput
    none?: WeddingMemberWhereInput
  }

  export type WeddingInviteListRelationFilter = {
    every?: WeddingInviteWhereInput
    some?: WeddingInviteWhereInput
    none?: WeddingInviteWhereInput
  }

  export type TaskListRelationFilter = {
    every?: TaskWhereInput
    some?: TaskWhereInput
    none?: TaskWhereInput
  }

  export type GuestListRelationFilter = {
    every?: GuestWhereInput
    some?: GuestWhereInput
    none?: GuestWhereInput
  }

  export type BudgetItemListRelationFilter = {
    every?: BudgetItemWhereInput
    some?: BudgetItemWhereInput
    none?: BudgetItemWhereInput
  }

  export type WeddingWebsiteNullableScalarRelationFilter = {
    is?: WeddingWebsiteWhereInput | null
    isNot?: WeddingWebsiteWhereInput | null
  }

  export type WeddingInvitationNullableScalarRelationFilter = {
    is?: WeddingInvitationWhereInput | null
    isNot?: WeddingInvitationWhereInput | null
  }

  export type WeddingMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WeddingInviteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GuestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BudgetItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WeddingCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    date?: SortOrder
    city?: SortOrder
    guests?: SortOrder
    budget?: SortOrder
    partnerOneName?: SortOrder
    partnerTwoName?: SortOrder
    couplePhotoUrl?: SortOrder
    planningStage?: SortOrder
    cityUndecided?: SortOrder
    guestsUndecided?: SortOrder
    dayPlan?: SortOrder
  }

  export type WeddingAvgOrderByAggregateInput = {
    guests?: SortOrder
    budget?: SortOrder
  }

  export type WeddingMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    date?: SortOrder
    city?: SortOrder
    guests?: SortOrder
    budget?: SortOrder
    partnerOneName?: SortOrder
    partnerTwoName?: SortOrder
    couplePhotoUrl?: SortOrder
    planningStage?: SortOrder
    cityUndecided?: SortOrder
    guestsUndecided?: SortOrder
  }

  export type WeddingMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    date?: SortOrder
    city?: SortOrder
    guests?: SortOrder
    budget?: SortOrder
    partnerOneName?: SortOrder
    partnerTwoName?: SortOrder
    couplePhotoUrl?: SortOrder
    planningStage?: SortOrder
    cityUndecided?: SortOrder
    guestsUndecided?: SortOrder
  }

  export type WeddingSumOrderByAggregateInput = {
    guests?: SortOrder
    budget?: SortOrder
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
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
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

  export type WeddingScalarRelationFilter = {
    is?: WeddingWhereInput
    isNot?: WeddingWhereInput
  }

  export type WeddingWebsiteCountOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    slug?: SortOrder
    templateId?: SortOrder
    published?: SortOrder
    publishedAt?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WeddingWebsiteMaxOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    slug?: SortOrder
    templateId?: SortOrder
    published?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WeddingWebsiteMinOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    slug?: SortOrder
    templateId?: SortOrder
    published?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
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
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type WeddingInvitationCountOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    templateId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WeddingInvitationMaxOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    templateId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WeddingInvitationMinOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    templateId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumWeddingMemberRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.WeddingMemberRole | EnumWeddingMemberRoleFieldRefInput<$PrismaModel>
    in?: $Enums.WeddingMemberRole[] | ListEnumWeddingMemberRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.WeddingMemberRole[] | ListEnumWeddingMemberRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumWeddingMemberRoleFilter<$PrismaModel> | $Enums.WeddingMemberRole
  }

  export type WeddingMemberCountOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type WeddingMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type WeddingMemberMinOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumWeddingMemberRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WeddingMemberRole | EnumWeddingMemberRoleFieldRefInput<$PrismaModel>
    in?: $Enums.WeddingMemberRole[] | ListEnumWeddingMemberRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.WeddingMemberRole[] | ListEnumWeddingMemberRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumWeddingMemberRoleWithAggregatesFilter<$PrismaModel> | $Enums.WeddingMemberRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumWeddingMemberRoleFilter<$PrismaModel>
    _max?: NestedEnumWeddingMemberRoleFilter<$PrismaModel>
  }

  export type WeddingInviteCountOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    acceptedAt?: SortOrder
    acceptedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type WeddingInviteMaxOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    acceptedAt?: SortOrder
    acceptedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type WeddingInviteMinOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    acceptedAt?: SortOrder
    acceptedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumTaskStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusFilter<$PrismaModel> | $Enums.TaskStatus
  }

  export type TaskCountOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    title?: SortOrder
    categorySlug?: SortOrder
    status?: SortOrder
    dueDate?: SortOrder
    dueRemindedAt?: SortOrder
    sortOrder?: SortOrder
    isCustom?: SortOrder
    assignee?: SortOrder
  }

  export type TaskAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type TaskMaxOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    title?: SortOrder
    categorySlug?: SortOrder
    status?: SortOrder
    dueDate?: SortOrder
    dueRemindedAt?: SortOrder
    sortOrder?: SortOrder
    isCustom?: SortOrder
    assignee?: SortOrder
  }

  export type TaskMinOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    title?: SortOrder
    categorySlug?: SortOrder
    status?: SortOrder
    dueDate?: SortOrder
    dueRemindedAt?: SortOrder
    sortOrder?: SortOrder
    isCustom?: SortOrder
    assignee?: SortOrder
  }

  export type TaskSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type EnumTaskStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel> | $Enums.TaskStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskStatusFilter<$PrismaModel>
    _max?: NestedEnumTaskStatusFilter<$PrismaModel>
  }

  export type EnumGuestSideFilter<$PrismaModel = never> = {
    equals?: $Enums.GuestSide | EnumGuestSideFieldRefInput<$PrismaModel>
    in?: $Enums.GuestSide[] | ListEnumGuestSideFieldRefInput<$PrismaModel>
    notIn?: $Enums.GuestSide[] | ListEnumGuestSideFieldRefInput<$PrismaModel>
    not?: NestedEnumGuestSideFilter<$PrismaModel> | $Enums.GuestSide
  }

  export type EnumRsvpStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RsvpStatus | EnumRsvpStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RsvpStatus[] | ListEnumRsvpStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RsvpStatus[] | ListEnumRsvpStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRsvpStatusFilter<$PrismaModel> | $Enums.RsvpStatus
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type GuestCountOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    side?: SortOrder
    rsvpStatus?: SortOrder
    plusOne?: SortOrder
    plusOneName?: SortOrder
    plusOneAttending?: SortOrder
    allergies?: SortOrder
    tableLabel?: SortOrder
    notes?: SortOrder
    inviteToken?: SortOrder
    respondedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GuestMaxOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    side?: SortOrder
    rsvpStatus?: SortOrder
    plusOne?: SortOrder
    plusOneName?: SortOrder
    plusOneAttending?: SortOrder
    allergies?: SortOrder
    tableLabel?: SortOrder
    notes?: SortOrder
    inviteToken?: SortOrder
    respondedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GuestMinOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    side?: SortOrder
    rsvpStatus?: SortOrder
    plusOne?: SortOrder
    plusOneName?: SortOrder
    plusOneAttending?: SortOrder
    allergies?: SortOrder
    tableLabel?: SortOrder
    notes?: SortOrder
    inviteToken?: SortOrder
    respondedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumGuestSideWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GuestSide | EnumGuestSideFieldRefInput<$PrismaModel>
    in?: $Enums.GuestSide[] | ListEnumGuestSideFieldRefInput<$PrismaModel>
    notIn?: $Enums.GuestSide[] | ListEnumGuestSideFieldRefInput<$PrismaModel>
    not?: NestedEnumGuestSideWithAggregatesFilter<$PrismaModel> | $Enums.GuestSide
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGuestSideFilter<$PrismaModel>
    _max?: NestedEnumGuestSideFilter<$PrismaModel>
  }

  export type EnumRsvpStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RsvpStatus | EnumRsvpStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RsvpStatus[] | ListEnumRsvpStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RsvpStatus[] | ListEnumRsvpStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRsvpStatusWithAggregatesFilter<$PrismaModel> | $Enums.RsvpStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRsvpStatusFilter<$PrismaModel>
    _max?: NestedEnumRsvpStatusFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type ExternalVendorNullableScalarRelationFilter = {
    is?: ExternalVendorWhereInput | null
    isNot?: ExternalVendorWhereInput | null
  }

  export type BudgetItemCountOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    category?: SortOrder
    title?: SortOrder
    estimated?: SortOrder
    actual?: SortOrder
    paid?: SortOrder
    notes?: SortOrder
    externalVendorId?: SortOrder
    createdAt?: SortOrder
  }

  export type BudgetItemAvgOrderByAggregateInput = {
    estimated?: SortOrder
    actual?: SortOrder
  }

  export type BudgetItemMaxOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    category?: SortOrder
    title?: SortOrder
    estimated?: SortOrder
    actual?: SortOrder
    paid?: SortOrder
    notes?: SortOrder
    externalVendorId?: SortOrder
    createdAt?: SortOrder
  }

  export type BudgetItemMinOrderByAggregateInput = {
    id?: SortOrder
    weddingId?: SortOrder
    category?: SortOrder
    title?: SortOrder
    estimated?: SortOrder
    actual?: SortOrder
    paid?: SortOrder
    notes?: SortOrder
    externalVendorId?: SortOrder
    createdAt?: SortOrder
  }

  export type BudgetItemSumOrderByAggregateInput = {
    estimated?: SortOrder
    actual?: SortOrder
  }

  export type ContentTopicCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    icon?: SortOrder
    coverUrl?: SortOrder
    sortOrder?: SortOrder
  }

  export type ContentTopicAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type ContentTopicMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    icon?: SortOrder
    coverUrl?: SortOrder
    sortOrder?: SortOrder
  }

  export type ContentTopicMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    icon?: SortOrder
    coverUrl?: SortOrder
    sortOrder?: SortOrder
  }

  export type ContentTopicSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type EnumContentKindFilter<$PrismaModel = never> = {
    equals?: $Enums.ContentKind | EnumContentKindFieldRefInput<$PrismaModel>
    in?: $Enums.ContentKind[] | ListEnumContentKindFieldRefInput<$PrismaModel>
    notIn?: $Enums.ContentKind[] | ListEnumContentKindFieldRefInput<$PrismaModel>
    not?: NestedEnumContentKindFilter<$PrismaModel> | $Enums.ContentKind
  }

  export type EnumContentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ContentStatus | EnumContentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ContentStatus[] | ListEnumContentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ContentStatus[] | ListEnumContentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumContentStatusFilter<$PrismaModel> | $Enums.ContentStatus
  }

  export type ContentTopicScalarRelationFilter = {
    is?: ContentTopicWhereInput
    isNot?: ContentTopicWhereInput
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type ContentPostCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    excerpt?: SortOrder
    coverUrl?: SortOrder
    kind?: SortOrder
    status?: SortOrder
    body?: SortOrder
    seoTitle?: SortOrder
    seoDescription?: SortOrder
    ogImageUrl?: SortOrder
    city?: SortOrder
    featured?: SortOrder
    topicId?: SortOrder
    authorId?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ContentPostMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    excerpt?: SortOrder
    coverUrl?: SortOrder
    kind?: SortOrder
    status?: SortOrder
    seoTitle?: SortOrder
    seoDescription?: SortOrder
    ogImageUrl?: SortOrder
    city?: SortOrder
    featured?: SortOrder
    topicId?: SortOrder
    authorId?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ContentPostMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    excerpt?: SortOrder
    coverUrl?: SortOrder
    kind?: SortOrder
    status?: SortOrder
    seoTitle?: SortOrder
    seoDescription?: SortOrder
    ogImageUrl?: SortOrder
    city?: SortOrder
    featured?: SortOrder
    topicId?: SortOrder
    authorId?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumContentKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ContentKind | EnumContentKindFieldRefInput<$PrismaModel>
    in?: $Enums.ContentKind[] | ListEnumContentKindFieldRefInput<$PrismaModel>
    notIn?: $Enums.ContentKind[] | ListEnumContentKindFieldRefInput<$PrismaModel>
    not?: NestedEnumContentKindWithAggregatesFilter<$PrismaModel> | $Enums.ContentKind
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumContentKindFilter<$PrismaModel>
    _max?: NestedEnumContentKindFilter<$PrismaModel>
  }

  export type EnumContentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ContentStatus | EnumContentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ContentStatus[] | ListEnumContentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ContentStatus[] | ListEnumContentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumContentStatusWithAggregatesFilter<$PrismaModel> | $Enums.ContentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumContentStatusFilter<$PrismaModel>
    _max?: NestedEnumContentStatusFilter<$PrismaModel>
  }

  export type WeddingCreateNestedOneWithoutUserInput = {
    create?: XOR<WeddingCreateWithoutUserInput, WeddingUncheckedCreateWithoutUserInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutUserInput
    connect?: WeddingWhereUniqueInput
  }

  export type WeddingMemberCreateNestedOneWithoutUserInput = {
    create?: XOR<WeddingMemberCreateWithoutUserInput, WeddingMemberUncheckedCreateWithoutUserInput>
    connectOrCreate?: WeddingMemberCreateOrConnectWithoutUserInput
    connect?: WeddingMemberWhereUniqueInput
  }

  export type ExternalVendorCreateNestedManyWithoutUserInput = {
    create?: XOR<ExternalVendorCreateWithoutUserInput, ExternalVendorUncheckedCreateWithoutUserInput> | ExternalVendorCreateWithoutUserInput[] | ExternalVendorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExternalVendorCreateOrConnectWithoutUserInput | ExternalVendorCreateOrConnectWithoutUserInput[]
    createMany?: ExternalVendorCreateManyUserInputEnvelope
    connect?: ExternalVendorWhereUniqueInput | ExternalVendorWhereUniqueInput[]
  }

  export type ContentPostCreateNestedManyWithoutAuthorInput = {
    create?: XOR<ContentPostCreateWithoutAuthorInput, ContentPostUncheckedCreateWithoutAuthorInput> | ContentPostCreateWithoutAuthorInput[] | ContentPostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: ContentPostCreateOrConnectWithoutAuthorInput | ContentPostCreateOrConnectWithoutAuthorInput[]
    createMany?: ContentPostCreateManyAuthorInputEnvelope
    connect?: ContentPostWhereUniqueInput | ContentPostWhereUniqueInput[]
  }

  export type PushDeviceCreateNestedManyWithoutUserInput = {
    create?: XOR<PushDeviceCreateWithoutUserInput, PushDeviceUncheckedCreateWithoutUserInput> | PushDeviceCreateWithoutUserInput[] | PushDeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PushDeviceCreateOrConnectWithoutUserInput | PushDeviceCreateOrConnectWithoutUserInput[]
    createMany?: PushDeviceCreateManyUserInputEnvelope
    connect?: PushDeviceWhereUniqueInput | PushDeviceWhereUniqueInput[]
  }

  export type WeddingUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<WeddingCreateWithoutUserInput, WeddingUncheckedCreateWithoutUserInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutUserInput
    connect?: WeddingWhereUniqueInput
  }

  export type WeddingMemberUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<WeddingMemberCreateWithoutUserInput, WeddingMemberUncheckedCreateWithoutUserInput>
    connectOrCreate?: WeddingMemberCreateOrConnectWithoutUserInput
    connect?: WeddingMemberWhereUniqueInput
  }

  export type ExternalVendorUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ExternalVendorCreateWithoutUserInput, ExternalVendorUncheckedCreateWithoutUserInput> | ExternalVendorCreateWithoutUserInput[] | ExternalVendorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExternalVendorCreateOrConnectWithoutUserInput | ExternalVendorCreateOrConnectWithoutUserInput[]
    createMany?: ExternalVendorCreateManyUserInputEnvelope
    connect?: ExternalVendorWhereUniqueInput | ExternalVendorWhereUniqueInput[]
  }

  export type ContentPostUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<ContentPostCreateWithoutAuthorInput, ContentPostUncheckedCreateWithoutAuthorInput> | ContentPostCreateWithoutAuthorInput[] | ContentPostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: ContentPostCreateOrConnectWithoutAuthorInput | ContentPostCreateOrConnectWithoutAuthorInput[]
    createMany?: ContentPostCreateManyAuthorInputEnvelope
    connect?: ContentPostWhereUniqueInput | ContentPostWhereUniqueInput[]
  }

  export type PushDeviceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PushDeviceCreateWithoutUserInput, PushDeviceUncheckedCreateWithoutUserInput> | PushDeviceCreateWithoutUserInput[] | PushDeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PushDeviceCreateOrConnectWithoutUserInput | PushDeviceCreateOrConnectWithoutUserInput[]
    createMany?: PushDeviceCreateManyUserInputEnvelope
    connect?: PushDeviceWhereUniqueInput | PushDeviceWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type WeddingUpdateOneWithoutUserNestedInput = {
    create?: XOR<WeddingCreateWithoutUserInput, WeddingUncheckedCreateWithoutUserInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutUserInput
    upsert?: WeddingUpsertWithoutUserInput
    disconnect?: WeddingWhereInput | boolean
    delete?: WeddingWhereInput | boolean
    connect?: WeddingWhereUniqueInput
    update?: XOR<XOR<WeddingUpdateToOneWithWhereWithoutUserInput, WeddingUpdateWithoutUserInput>, WeddingUncheckedUpdateWithoutUserInput>
  }

  export type WeddingMemberUpdateOneWithoutUserNestedInput = {
    create?: XOR<WeddingMemberCreateWithoutUserInput, WeddingMemberUncheckedCreateWithoutUserInput>
    connectOrCreate?: WeddingMemberCreateOrConnectWithoutUserInput
    upsert?: WeddingMemberUpsertWithoutUserInput
    disconnect?: WeddingMemberWhereInput | boolean
    delete?: WeddingMemberWhereInput | boolean
    connect?: WeddingMemberWhereUniqueInput
    update?: XOR<XOR<WeddingMemberUpdateToOneWithWhereWithoutUserInput, WeddingMemberUpdateWithoutUserInput>, WeddingMemberUncheckedUpdateWithoutUserInput>
  }

  export type ExternalVendorUpdateManyWithoutUserNestedInput = {
    create?: XOR<ExternalVendorCreateWithoutUserInput, ExternalVendorUncheckedCreateWithoutUserInput> | ExternalVendorCreateWithoutUserInput[] | ExternalVendorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExternalVendorCreateOrConnectWithoutUserInput | ExternalVendorCreateOrConnectWithoutUserInput[]
    upsert?: ExternalVendorUpsertWithWhereUniqueWithoutUserInput | ExternalVendorUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ExternalVendorCreateManyUserInputEnvelope
    set?: ExternalVendorWhereUniqueInput | ExternalVendorWhereUniqueInput[]
    disconnect?: ExternalVendorWhereUniqueInput | ExternalVendorWhereUniqueInput[]
    delete?: ExternalVendorWhereUniqueInput | ExternalVendorWhereUniqueInput[]
    connect?: ExternalVendorWhereUniqueInput | ExternalVendorWhereUniqueInput[]
    update?: ExternalVendorUpdateWithWhereUniqueWithoutUserInput | ExternalVendorUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ExternalVendorUpdateManyWithWhereWithoutUserInput | ExternalVendorUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ExternalVendorScalarWhereInput | ExternalVendorScalarWhereInput[]
  }

  export type ContentPostUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<ContentPostCreateWithoutAuthorInput, ContentPostUncheckedCreateWithoutAuthorInput> | ContentPostCreateWithoutAuthorInput[] | ContentPostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: ContentPostCreateOrConnectWithoutAuthorInput | ContentPostCreateOrConnectWithoutAuthorInput[]
    upsert?: ContentPostUpsertWithWhereUniqueWithoutAuthorInput | ContentPostUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: ContentPostCreateManyAuthorInputEnvelope
    set?: ContentPostWhereUniqueInput | ContentPostWhereUniqueInput[]
    disconnect?: ContentPostWhereUniqueInput | ContentPostWhereUniqueInput[]
    delete?: ContentPostWhereUniqueInput | ContentPostWhereUniqueInput[]
    connect?: ContentPostWhereUniqueInput | ContentPostWhereUniqueInput[]
    update?: ContentPostUpdateWithWhereUniqueWithoutAuthorInput | ContentPostUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: ContentPostUpdateManyWithWhereWithoutAuthorInput | ContentPostUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: ContentPostScalarWhereInput | ContentPostScalarWhereInput[]
  }

  export type PushDeviceUpdateManyWithoutUserNestedInput = {
    create?: XOR<PushDeviceCreateWithoutUserInput, PushDeviceUncheckedCreateWithoutUserInput> | PushDeviceCreateWithoutUserInput[] | PushDeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PushDeviceCreateOrConnectWithoutUserInput | PushDeviceCreateOrConnectWithoutUserInput[]
    upsert?: PushDeviceUpsertWithWhereUniqueWithoutUserInput | PushDeviceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PushDeviceCreateManyUserInputEnvelope
    set?: PushDeviceWhereUniqueInput | PushDeviceWhereUniqueInput[]
    disconnect?: PushDeviceWhereUniqueInput | PushDeviceWhereUniqueInput[]
    delete?: PushDeviceWhereUniqueInput | PushDeviceWhereUniqueInput[]
    connect?: PushDeviceWhereUniqueInput | PushDeviceWhereUniqueInput[]
    update?: PushDeviceUpdateWithWhereUniqueWithoutUserInput | PushDeviceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PushDeviceUpdateManyWithWhereWithoutUserInput | PushDeviceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PushDeviceScalarWhereInput | PushDeviceScalarWhereInput[]
  }

  export type WeddingUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<WeddingCreateWithoutUserInput, WeddingUncheckedCreateWithoutUserInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutUserInput
    upsert?: WeddingUpsertWithoutUserInput
    disconnect?: WeddingWhereInput | boolean
    delete?: WeddingWhereInput | boolean
    connect?: WeddingWhereUniqueInput
    update?: XOR<XOR<WeddingUpdateToOneWithWhereWithoutUserInput, WeddingUpdateWithoutUserInput>, WeddingUncheckedUpdateWithoutUserInput>
  }

  export type WeddingMemberUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<WeddingMemberCreateWithoutUserInput, WeddingMemberUncheckedCreateWithoutUserInput>
    connectOrCreate?: WeddingMemberCreateOrConnectWithoutUserInput
    upsert?: WeddingMemberUpsertWithoutUserInput
    disconnect?: WeddingMemberWhereInput | boolean
    delete?: WeddingMemberWhereInput | boolean
    connect?: WeddingMemberWhereUniqueInput
    update?: XOR<XOR<WeddingMemberUpdateToOneWithWhereWithoutUserInput, WeddingMemberUpdateWithoutUserInput>, WeddingMemberUncheckedUpdateWithoutUserInput>
  }

  export type ExternalVendorUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ExternalVendorCreateWithoutUserInput, ExternalVendorUncheckedCreateWithoutUserInput> | ExternalVendorCreateWithoutUserInput[] | ExternalVendorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExternalVendorCreateOrConnectWithoutUserInput | ExternalVendorCreateOrConnectWithoutUserInput[]
    upsert?: ExternalVendorUpsertWithWhereUniqueWithoutUserInput | ExternalVendorUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ExternalVendorCreateManyUserInputEnvelope
    set?: ExternalVendorWhereUniqueInput | ExternalVendorWhereUniqueInput[]
    disconnect?: ExternalVendorWhereUniqueInput | ExternalVendorWhereUniqueInput[]
    delete?: ExternalVendorWhereUniqueInput | ExternalVendorWhereUniqueInput[]
    connect?: ExternalVendorWhereUniqueInput | ExternalVendorWhereUniqueInput[]
    update?: ExternalVendorUpdateWithWhereUniqueWithoutUserInput | ExternalVendorUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ExternalVendorUpdateManyWithWhereWithoutUserInput | ExternalVendorUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ExternalVendorScalarWhereInput | ExternalVendorScalarWhereInput[]
  }

  export type ContentPostUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<ContentPostCreateWithoutAuthorInput, ContentPostUncheckedCreateWithoutAuthorInput> | ContentPostCreateWithoutAuthorInput[] | ContentPostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: ContentPostCreateOrConnectWithoutAuthorInput | ContentPostCreateOrConnectWithoutAuthorInput[]
    upsert?: ContentPostUpsertWithWhereUniqueWithoutAuthorInput | ContentPostUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: ContentPostCreateManyAuthorInputEnvelope
    set?: ContentPostWhereUniqueInput | ContentPostWhereUniqueInput[]
    disconnect?: ContentPostWhereUniqueInput | ContentPostWhereUniqueInput[]
    delete?: ContentPostWhereUniqueInput | ContentPostWhereUniqueInput[]
    connect?: ContentPostWhereUniqueInput | ContentPostWhereUniqueInput[]
    update?: ContentPostUpdateWithWhereUniqueWithoutAuthorInput | ContentPostUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: ContentPostUpdateManyWithWhereWithoutAuthorInput | ContentPostUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: ContentPostScalarWhereInput | ContentPostScalarWhereInput[]
  }

  export type PushDeviceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PushDeviceCreateWithoutUserInput, PushDeviceUncheckedCreateWithoutUserInput> | PushDeviceCreateWithoutUserInput[] | PushDeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PushDeviceCreateOrConnectWithoutUserInput | PushDeviceCreateOrConnectWithoutUserInput[]
    upsert?: PushDeviceUpsertWithWhereUniqueWithoutUserInput | PushDeviceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PushDeviceCreateManyUserInputEnvelope
    set?: PushDeviceWhereUniqueInput | PushDeviceWhereUniqueInput[]
    disconnect?: PushDeviceWhereUniqueInput | PushDeviceWhereUniqueInput[]
    delete?: PushDeviceWhereUniqueInput | PushDeviceWhereUniqueInput[]
    connect?: PushDeviceWhereUniqueInput | PushDeviceWhereUniqueInput[]
    update?: PushDeviceUpdateWithWhereUniqueWithoutUserInput | PushDeviceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PushDeviceUpdateManyWithWhereWithoutUserInput | PushDeviceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PushDeviceScalarWhereInput | PushDeviceScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutPushDevicesInput = {
    create?: XOR<UserCreateWithoutPushDevicesInput, UserUncheckedCreateWithoutPushDevicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPushDevicesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPushDevicesNestedInput = {
    create?: XOR<UserCreateWithoutPushDevicesInput, UserUncheckedCreateWithoutPushDevicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPushDevicesInput
    upsert?: UserUpsertWithoutPushDevicesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPushDevicesInput, UserUpdateWithoutPushDevicesInput>, UserUncheckedUpdateWithoutPushDevicesInput>
  }

  export type UserCreateNestedOneWithoutExternalVendorsInput = {
    create?: XOR<UserCreateWithoutExternalVendorsInput, UserUncheckedCreateWithoutExternalVendorsInput>
    connectOrCreate?: UserCreateOrConnectWithoutExternalVendorsInput
    connect?: UserWhereUniqueInput
  }

  export type BudgetItemCreateNestedOneWithoutExternalVendorInput = {
    create?: XOR<BudgetItemCreateWithoutExternalVendorInput, BudgetItemUncheckedCreateWithoutExternalVendorInput>
    connectOrCreate?: BudgetItemCreateOrConnectWithoutExternalVendorInput
    connect?: BudgetItemWhereUniqueInput
  }

  export type BudgetItemUncheckedCreateNestedOneWithoutExternalVendorInput = {
    create?: XOR<BudgetItemCreateWithoutExternalVendorInput, BudgetItemUncheckedCreateWithoutExternalVendorInput>
    connectOrCreate?: BudgetItemCreateOrConnectWithoutExternalVendorInput
    connect?: BudgetItemWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumVendorPipelineStageFieldUpdateOperationsInput = {
    set?: $Enums.VendorPipelineStage
  }

  export type UserUpdateOneRequiredWithoutExternalVendorsNestedInput = {
    create?: XOR<UserCreateWithoutExternalVendorsInput, UserUncheckedCreateWithoutExternalVendorsInput>
    connectOrCreate?: UserCreateOrConnectWithoutExternalVendorsInput
    upsert?: UserUpsertWithoutExternalVendorsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutExternalVendorsInput, UserUpdateWithoutExternalVendorsInput>, UserUncheckedUpdateWithoutExternalVendorsInput>
  }

  export type BudgetItemUpdateOneWithoutExternalVendorNestedInput = {
    create?: XOR<BudgetItemCreateWithoutExternalVendorInput, BudgetItemUncheckedCreateWithoutExternalVendorInput>
    connectOrCreate?: BudgetItemCreateOrConnectWithoutExternalVendorInput
    upsert?: BudgetItemUpsertWithoutExternalVendorInput
    disconnect?: BudgetItemWhereInput | boolean
    delete?: BudgetItemWhereInput | boolean
    connect?: BudgetItemWhereUniqueInput
    update?: XOR<XOR<BudgetItemUpdateToOneWithWhereWithoutExternalVendorInput, BudgetItemUpdateWithoutExternalVendorInput>, BudgetItemUncheckedUpdateWithoutExternalVendorInput>
  }

  export type BudgetItemUncheckedUpdateOneWithoutExternalVendorNestedInput = {
    create?: XOR<BudgetItemCreateWithoutExternalVendorInput, BudgetItemUncheckedCreateWithoutExternalVendorInput>
    connectOrCreate?: BudgetItemCreateOrConnectWithoutExternalVendorInput
    upsert?: BudgetItemUpsertWithoutExternalVendorInput
    disconnect?: BudgetItemWhereInput | boolean
    delete?: BudgetItemWhereInput | boolean
    connect?: BudgetItemWhereUniqueInput
    update?: XOR<XOR<BudgetItemUpdateToOneWithWhereWithoutExternalVendorInput, BudgetItemUpdateWithoutExternalVendorInput>, BudgetItemUncheckedUpdateWithoutExternalVendorInput>
  }

  export type UserCreateNestedOneWithoutWeddingInput = {
    create?: XOR<UserCreateWithoutWeddingInput, UserUncheckedCreateWithoutWeddingInput>
    connectOrCreate?: UserCreateOrConnectWithoutWeddingInput
    connect?: UserWhereUniqueInput
  }

  export type WeddingMemberCreateNestedManyWithoutWeddingInput = {
    create?: XOR<WeddingMemberCreateWithoutWeddingInput, WeddingMemberUncheckedCreateWithoutWeddingInput> | WeddingMemberCreateWithoutWeddingInput[] | WeddingMemberUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: WeddingMemberCreateOrConnectWithoutWeddingInput | WeddingMemberCreateOrConnectWithoutWeddingInput[]
    createMany?: WeddingMemberCreateManyWeddingInputEnvelope
    connect?: WeddingMemberWhereUniqueInput | WeddingMemberWhereUniqueInput[]
  }

  export type WeddingInviteCreateNestedManyWithoutWeddingInput = {
    create?: XOR<WeddingInviteCreateWithoutWeddingInput, WeddingInviteUncheckedCreateWithoutWeddingInput> | WeddingInviteCreateWithoutWeddingInput[] | WeddingInviteUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: WeddingInviteCreateOrConnectWithoutWeddingInput | WeddingInviteCreateOrConnectWithoutWeddingInput[]
    createMany?: WeddingInviteCreateManyWeddingInputEnvelope
    connect?: WeddingInviteWhereUniqueInput | WeddingInviteWhereUniqueInput[]
  }

  export type TaskCreateNestedManyWithoutWeddingInput = {
    create?: XOR<TaskCreateWithoutWeddingInput, TaskUncheckedCreateWithoutWeddingInput> | TaskCreateWithoutWeddingInput[] | TaskUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutWeddingInput | TaskCreateOrConnectWithoutWeddingInput[]
    createMany?: TaskCreateManyWeddingInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type GuestCreateNestedManyWithoutWeddingInput = {
    create?: XOR<GuestCreateWithoutWeddingInput, GuestUncheckedCreateWithoutWeddingInput> | GuestCreateWithoutWeddingInput[] | GuestUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: GuestCreateOrConnectWithoutWeddingInput | GuestCreateOrConnectWithoutWeddingInput[]
    createMany?: GuestCreateManyWeddingInputEnvelope
    connect?: GuestWhereUniqueInput | GuestWhereUniqueInput[]
  }

  export type BudgetItemCreateNestedManyWithoutWeddingInput = {
    create?: XOR<BudgetItemCreateWithoutWeddingInput, BudgetItemUncheckedCreateWithoutWeddingInput> | BudgetItemCreateWithoutWeddingInput[] | BudgetItemUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: BudgetItemCreateOrConnectWithoutWeddingInput | BudgetItemCreateOrConnectWithoutWeddingInput[]
    createMany?: BudgetItemCreateManyWeddingInputEnvelope
    connect?: BudgetItemWhereUniqueInput | BudgetItemWhereUniqueInput[]
  }

  export type WeddingWebsiteCreateNestedOneWithoutWeddingInput = {
    create?: XOR<WeddingWebsiteCreateWithoutWeddingInput, WeddingWebsiteUncheckedCreateWithoutWeddingInput>
    connectOrCreate?: WeddingWebsiteCreateOrConnectWithoutWeddingInput
    connect?: WeddingWebsiteWhereUniqueInput
  }

  export type WeddingInvitationCreateNestedOneWithoutWeddingInput = {
    create?: XOR<WeddingInvitationCreateWithoutWeddingInput, WeddingInvitationUncheckedCreateWithoutWeddingInput>
    connectOrCreate?: WeddingInvitationCreateOrConnectWithoutWeddingInput
    connect?: WeddingInvitationWhereUniqueInput
  }

  export type WeddingMemberUncheckedCreateNestedManyWithoutWeddingInput = {
    create?: XOR<WeddingMemberCreateWithoutWeddingInput, WeddingMemberUncheckedCreateWithoutWeddingInput> | WeddingMemberCreateWithoutWeddingInput[] | WeddingMemberUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: WeddingMemberCreateOrConnectWithoutWeddingInput | WeddingMemberCreateOrConnectWithoutWeddingInput[]
    createMany?: WeddingMemberCreateManyWeddingInputEnvelope
    connect?: WeddingMemberWhereUniqueInput | WeddingMemberWhereUniqueInput[]
  }

  export type WeddingInviteUncheckedCreateNestedManyWithoutWeddingInput = {
    create?: XOR<WeddingInviteCreateWithoutWeddingInput, WeddingInviteUncheckedCreateWithoutWeddingInput> | WeddingInviteCreateWithoutWeddingInput[] | WeddingInviteUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: WeddingInviteCreateOrConnectWithoutWeddingInput | WeddingInviteCreateOrConnectWithoutWeddingInput[]
    createMany?: WeddingInviteCreateManyWeddingInputEnvelope
    connect?: WeddingInviteWhereUniqueInput | WeddingInviteWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutWeddingInput = {
    create?: XOR<TaskCreateWithoutWeddingInput, TaskUncheckedCreateWithoutWeddingInput> | TaskCreateWithoutWeddingInput[] | TaskUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutWeddingInput | TaskCreateOrConnectWithoutWeddingInput[]
    createMany?: TaskCreateManyWeddingInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type GuestUncheckedCreateNestedManyWithoutWeddingInput = {
    create?: XOR<GuestCreateWithoutWeddingInput, GuestUncheckedCreateWithoutWeddingInput> | GuestCreateWithoutWeddingInput[] | GuestUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: GuestCreateOrConnectWithoutWeddingInput | GuestCreateOrConnectWithoutWeddingInput[]
    createMany?: GuestCreateManyWeddingInputEnvelope
    connect?: GuestWhereUniqueInput | GuestWhereUniqueInput[]
  }

  export type BudgetItemUncheckedCreateNestedManyWithoutWeddingInput = {
    create?: XOR<BudgetItemCreateWithoutWeddingInput, BudgetItemUncheckedCreateWithoutWeddingInput> | BudgetItemCreateWithoutWeddingInput[] | BudgetItemUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: BudgetItemCreateOrConnectWithoutWeddingInput | BudgetItemCreateOrConnectWithoutWeddingInput[]
    createMany?: BudgetItemCreateManyWeddingInputEnvelope
    connect?: BudgetItemWhereUniqueInput | BudgetItemWhereUniqueInput[]
  }

  export type WeddingWebsiteUncheckedCreateNestedOneWithoutWeddingInput = {
    create?: XOR<WeddingWebsiteCreateWithoutWeddingInput, WeddingWebsiteUncheckedCreateWithoutWeddingInput>
    connectOrCreate?: WeddingWebsiteCreateOrConnectWithoutWeddingInput
    connect?: WeddingWebsiteWhereUniqueInput
  }

  export type WeddingInvitationUncheckedCreateNestedOneWithoutWeddingInput = {
    create?: XOR<WeddingInvitationCreateWithoutWeddingInput, WeddingInvitationUncheckedCreateWithoutWeddingInput>
    connectOrCreate?: WeddingInvitationCreateOrConnectWithoutWeddingInput
    connect?: WeddingInvitationWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutWeddingNestedInput = {
    create?: XOR<UserCreateWithoutWeddingInput, UserUncheckedCreateWithoutWeddingInput>
    connectOrCreate?: UserCreateOrConnectWithoutWeddingInput
    upsert?: UserUpsertWithoutWeddingInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWeddingInput, UserUpdateWithoutWeddingInput>, UserUncheckedUpdateWithoutWeddingInput>
  }

  export type WeddingMemberUpdateManyWithoutWeddingNestedInput = {
    create?: XOR<WeddingMemberCreateWithoutWeddingInput, WeddingMemberUncheckedCreateWithoutWeddingInput> | WeddingMemberCreateWithoutWeddingInput[] | WeddingMemberUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: WeddingMemberCreateOrConnectWithoutWeddingInput | WeddingMemberCreateOrConnectWithoutWeddingInput[]
    upsert?: WeddingMemberUpsertWithWhereUniqueWithoutWeddingInput | WeddingMemberUpsertWithWhereUniqueWithoutWeddingInput[]
    createMany?: WeddingMemberCreateManyWeddingInputEnvelope
    set?: WeddingMemberWhereUniqueInput | WeddingMemberWhereUniqueInput[]
    disconnect?: WeddingMemberWhereUniqueInput | WeddingMemberWhereUniqueInput[]
    delete?: WeddingMemberWhereUniqueInput | WeddingMemberWhereUniqueInput[]
    connect?: WeddingMemberWhereUniqueInput | WeddingMemberWhereUniqueInput[]
    update?: WeddingMemberUpdateWithWhereUniqueWithoutWeddingInput | WeddingMemberUpdateWithWhereUniqueWithoutWeddingInput[]
    updateMany?: WeddingMemberUpdateManyWithWhereWithoutWeddingInput | WeddingMemberUpdateManyWithWhereWithoutWeddingInput[]
    deleteMany?: WeddingMemberScalarWhereInput | WeddingMemberScalarWhereInput[]
  }

  export type WeddingInviteUpdateManyWithoutWeddingNestedInput = {
    create?: XOR<WeddingInviteCreateWithoutWeddingInput, WeddingInviteUncheckedCreateWithoutWeddingInput> | WeddingInviteCreateWithoutWeddingInput[] | WeddingInviteUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: WeddingInviteCreateOrConnectWithoutWeddingInput | WeddingInviteCreateOrConnectWithoutWeddingInput[]
    upsert?: WeddingInviteUpsertWithWhereUniqueWithoutWeddingInput | WeddingInviteUpsertWithWhereUniqueWithoutWeddingInput[]
    createMany?: WeddingInviteCreateManyWeddingInputEnvelope
    set?: WeddingInviteWhereUniqueInput | WeddingInviteWhereUniqueInput[]
    disconnect?: WeddingInviteWhereUniqueInput | WeddingInviteWhereUniqueInput[]
    delete?: WeddingInviteWhereUniqueInput | WeddingInviteWhereUniqueInput[]
    connect?: WeddingInviteWhereUniqueInput | WeddingInviteWhereUniqueInput[]
    update?: WeddingInviteUpdateWithWhereUniqueWithoutWeddingInput | WeddingInviteUpdateWithWhereUniqueWithoutWeddingInput[]
    updateMany?: WeddingInviteUpdateManyWithWhereWithoutWeddingInput | WeddingInviteUpdateManyWithWhereWithoutWeddingInput[]
    deleteMany?: WeddingInviteScalarWhereInput | WeddingInviteScalarWhereInput[]
  }

  export type TaskUpdateManyWithoutWeddingNestedInput = {
    create?: XOR<TaskCreateWithoutWeddingInput, TaskUncheckedCreateWithoutWeddingInput> | TaskCreateWithoutWeddingInput[] | TaskUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutWeddingInput | TaskCreateOrConnectWithoutWeddingInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutWeddingInput | TaskUpsertWithWhereUniqueWithoutWeddingInput[]
    createMany?: TaskCreateManyWeddingInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutWeddingInput | TaskUpdateWithWhereUniqueWithoutWeddingInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutWeddingInput | TaskUpdateManyWithWhereWithoutWeddingInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type GuestUpdateManyWithoutWeddingNestedInput = {
    create?: XOR<GuestCreateWithoutWeddingInput, GuestUncheckedCreateWithoutWeddingInput> | GuestCreateWithoutWeddingInput[] | GuestUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: GuestCreateOrConnectWithoutWeddingInput | GuestCreateOrConnectWithoutWeddingInput[]
    upsert?: GuestUpsertWithWhereUniqueWithoutWeddingInput | GuestUpsertWithWhereUniqueWithoutWeddingInput[]
    createMany?: GuestCreateManyWeddingInputEnvelope
    set?: GuestWhereUniqueInput | GuestWhereUniqueInput[]
    disconnect?: GuestWhereUniqueInput | GuestWhereUniqueInput[]
    delete?: GuestWhereUniqueInput | GuestWhereUniqueInput[]
    connect?: GuestWhereUniqueInput | GuestWhereUniqueInput[]
    update?: GuestUpdateWithWhereUniqueWithoutWeddingInput | GuestUpdateWithWhereUniqueWithoutWeddingInput[]
    updateMany?: GuestUpdateManyWithWhereWithoutWeddingInput | GuestUpdateManyWithWhereWithoutWeddingInput[]
    deleteMany?: GuestScalarWhereInput | GuestScalarWhereInput[]
  }

  export type BudgetItemUpdateManyWithoutWeddingNestedInput = {
    create?: XOR<BudgetItemCreateWithoutWeddingInput, BudgetItemUncheckedCreateWithoutWeddingInput> | BudgetItemCreateWithoutWeddingInput[] | BudgetItemUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: BudgetItemCreateOrConnectWithoutWeddingInput | BudgetItemCreateOrConnectWithoutWeddingInput[]
    upsert?: BudgetItemUpsertWithWhereUniqueWithoutWeddingInput | BudgetItemUpsertWithWhereUniqueWithoutWeddingInput[]
    createMany?: BudgetItemCreateManyWeddingInputEnvelope
    set?: BudgetItemWhereUniqueInput | BudgetItemWhereUniqueInput[]
    disconnect?: BudgetItemWhereUniqueInput | BudgetItemWhereUniqueInput[]
    delete?: BudgetItemWhereUniqueInput | BudgetItemWhereUniqueInput[]
    connect?: BudgetItemWhereUniqueInput | BudgetItemWhereUniqueInput[]
    update?: BudgetItemUpdateWithWhereUniqueWithoutWeddingInput | BudgetItemUpdateWithWhereUniqueWithoutWeddingInput[]
    updateMany?: BudgetItemUpdateManyWithWhereWithoutWeddingInput | BudgetItemUpdateManyWithWhereWithoutWeddingInput[]
    deleteMany?: BudgetItemScalarWhereInput | BudgetItemScalarWhereInput[]
  }

  export type WeddingWebsiteUpdateOneWithoutWeddingNestedInput = {
    create?: XOR<WeddingWebsiteCreateWithoutWeddingInput, WeddingWebsiteUncheckedCreateWithoutWeddingInput>
    connectOrCreate?: WeddingWebsiteCreateOrConnectWithoutWeddingInput
    upsert?: WeddingWebsiteUpsertWithoutWeddingInput
    disconnect?: WeddingWebsiteWhereInput | boolean
    delete?: WeddingWebsiteWhereInput | boolean
    connect?: WeddingWebsiteWhereUniqueInput
    update?: XOR<XOR<WeddingWebsiteUpdateToOneWithWhereWithoutWeddingInput, WeddingWebsiteUpdateWithoutWeddingInput>, WeddingWebsiteUncheckedUpdateWithoutWeddingInput>
  }

  export type WeddingInvitationUpdateOneWithoutWeddingNestedInput = {
    create?: XOR<WeddingInvitationCreateWithoutWeddingInput, WeddingInvitationUncheckedCreateWithoutWeddingInput>
    connectOrCreate?: WeddingInvitationCreateOrConnectWithoutWeddingInput
    upsert?: WeddingInvitationUpsertWithoutWeddingInput
    disconnect?: WeddingInvitationWhereInput | boolean
    delete?: WeddingInvitationWhereInput | boolean
    connect?: WeddingInvitationWhereUniqueInput
    update?: XOR<XOR<WeddingInvitationUpdateToOneWithWhereWithoutWeddingInput, WeddingInvitationUpdateWithoutWeddingInput>, WeddingInvitationUncheckedUpdateWithoutWeddingInput>
  }

  export type WeddingMemberUncheckedUpdateManyWithoutWeddingNestedInput = {
    create?: XOR<WeddingMemberCreateWithoutWeddingInput, WeddingMemberUncheckedCreateWithoutWeddingInput> | WeddingMemberCreateWithoutWeddingInput[] | WeddingMemberUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: WeddingMemberCreateOrConnectWithoutWeddingInput | WeddingMemberCreateOrConnectWithoutWeddingInput[]
    upsert?: WeddingMemberUpsertWithWhereUniqueWithoutWeddingInput | WeddingMemberUpsertWithWhereUniqueWithoutWeddingInput[]
    createMany?: WeddingMemberCreateManyWeddingInputEnvelope
    set?: WeddingMemberWhereUniqueInput | WeddingMemberWhereUniqueInput[]
    disconnect?: WeddingMemberWhereUniqueInput | WeddingMemberWhereUniqueInput[]
    delete?: WeddingMemberWhereUniqueInput | WeddingMemberWhereUniqueInput[]
    connect?: WeddingMemberWhereUniqueInput | WeddingMemberWhereUniqueInput[]
    update?: WeddingMemberUpdateWithWhereUniqueWithoutWeddingInput | WeddingMemberUpdateWithWhereUniqueWithoutWeddingInput[]
    updateMany?: WeddingMemberUpdateManyWithWhereWithoutWeddingInput | WeddingMemberUpdateManyWithWhereWithoutWeddingInput[]
    deleteMany?: WeddingMemberScalarWhereInput | WeddingMemberScalarWhereInput[]
  }

  export type WeddingInviteUncheckedUpdateManyWithoutWeddingNestedInput = {
    create?: XOR<WeddingInviteCreateWithoutWeddingInput, WeddingInviteUncheckedCreateWithoutWeddingInput> | WeddingInviteCreateWithoutWeddingInput[] | WeddingInviteUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: WeddingInviteCreateOrConnectWithoutWeddingInput | WeddingInviteCreateOrConnectWithoutWeddingInput[]
    upsert?: WeddingInviteUpsertWithWhereUniqueWithoutWeddingInput | WeddingInviteUpsertWithWhereUniqueWithoutWeddingInput[]
    createMany?: WeddingInviteCreateManyWeddingInputEnvelope
    set?: WeddingInviteWhereUniqueInput | WeddingInviteWhereUniqueInput[]
    disconnect?: WeddingInviteWhereUniqueInput | WeddingInviteWhereUniqueInput[]
    delete?: WeddingInviteWhereUniqueInput | WeddingInviteWhereUniqueInput[]
    connect?: WeddingInviteWhereUniqueInput | WeddingInviteWhereUniqueInput[]
    update?: WeddingInviteUpdateWithWhereUniqueWithoutWeddingInput | WeddingInviteUpdateWithWhereUniqueWithoutWeddingInput[]
    updateMany?: WeddingInviteUpdateManyWithWhereWithoutWeddingInput | WeddingInviteUpdateManyWithWhereWithoutWeddingInput[]
    deleteMany?: WeddingInviteScalarWhereInput | WeddingInviteScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutWeddingNestedInput = {
    create?: XOR<TaskCreateWithoutWeddingInput, TaskUncheckedCreateWithoutWeddingInput> | TaskCreateWithoutWeddingInput[] | TaskUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutWeddingInput | TaskCreateOrConnectWithoutWeddingInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutWeddingInput | TaskUpsertWithWhereUniqueWithoutWeddingInput[]
    createMany?: TaskCreateManyWeddingInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutWeddingInput | TaskUpdateWithWhereUniqueWithoutWeddingInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutWeddingInput | TaskUpdateManyWithWhereWithoutWeddingInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type GuestUncheckedUpdateManyWithoutWeddingNestedInput = {
    create?: XOR<GuestCreateWithoutWeddingInput, GuestUncheckedCreateWithoutWeddingInput> | GuestCreateWithoutWeddingInput[] | GuestUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: GuestCreateOrConnectWithoutWeddingInput | GuestCreateOrConnectWithoutWeddingInput[]
    upsert?: GuestUpsertWithWhereUniqueWithoutWeddingInput | GuestUpsertWithWhereUniqueWithoutWeddingInput[]
    createMany?: GuestCreateManyWeddingInputEnvelope
    set?: GuestWhereUniqueInput | GuestWhereUniqueInput[]
    disconnect?: GuestWhereUniqueInput | GuestWhereUniqueInput[]
    delete?: GuestWhereUniqueInput | GuestWhereUniqueInput[]
    connect?: GuestWhereUniqueInput | GuestWhereUniqueInput[]
    update?: GuestUpdateWithWhereUniqueWithoutWeddingInput | GuestUpdateWithWhereUniqueWithoutWeddingInput[]
    updateMany?: GuestUpdateManyWithWhereWithoutWeddingInput | GuestUpdateManyWithWhereWithoutWeddingInput[]
    deleteMany?: GuestScalarWhereInput | GuestScalarWhereInput[]
  }

  export type BudgetItemUncheckedUpdateManyWithoutWeddingNestedInput = {
    create?: XOR<BudgetItemCreateWithoutWeddingInput, BudgetItemUncheckedCreateWithoutWeddingInput> | BudgetItemCreateWithoutWeddingInput[] | BudgetItemUncheckedCreateWithoutWeddingInput[]
    connectOrCreate?: BudgetItemCreateOrConnectWithoutWeddingInput | BudgetItemCreateOrConnectWithoutWeddingInput[]
    upsert?: BudgetItemUpsertWithWhereUniqueWithoutWeddingInput | BudgetItemUpsertWithWhereUniqueWithoutWeddingInput[]
    createMany?: BudgetItemCreateManyWeddingInputEnvelope
    set?: BudgetItemWhereUniqueInput | BudgetItemWhereUniqueInput[]
    disconnect?: BudgetItemWhereUniqueInput | BudgetItemWhereUniqueInput[]
    delete?: BudgetItemWhereUniqueInput | BudgetItemWhereUniqueInput[]
    connect?: BudgetItemWhereUniqueInput | BudgetItemWhereUniqueInput[]
    update?: BudgetItemUpdateWithWhereUniqueWithoutWeddingInput | BudgetItemUpdateWithWhereUniqueWithoutWeddingInput[]
    updateMany?: BudgetItemUpdateManyWithWhereWithoutWeddingInput | BudgetItemUpdateManyWithWhereWithoutWeddingInput[]
    deleteMany?: BudgetItemScalarWhereInput | BudgetItemScalarWhereInput[]
  }

  export type WeddingWebsiteUncheckedUpdateOneWithoutWeddingNestedInput = {
    create?: XOR<WeddingWebsiteCreateWithoutWeddingInput, WeddingWebsiteUncheckedCreateWithoutWeddingInput>
    connectOrCreate?: WeddingWebsiteCreateOrConnectWithoutWeddingInput
    upsert?: WeddingWebsiteUpsertWithoutWeddingInput
    disconnect?: WeddingWebsiteWhereInput | boolean
    delete?: WeddingWebsiteWhereInput | boolean
    connect?: WeddingWebsiteWhereUniqueInput
    update?: XOR<XOR<WeddingWebsiteUpdateToOneWithWhereWithoutWeddingInput, WeddingWebsiteUpdateWithoutWeddingInput>, WeddingWebsiteUncheckedUpdateWithoutWeddingInput>
  }

  export type WeddingInvitationUncheckedUpdateOneWithoutWeddingNestedInput = {
    create?: XOR<WeddingInvitationCreateWithoutWeddingInput, WeddingInvitationUncheckedCreateWithoutWeddingInput>
    connectOrCreate?: WeddingInvitationCreateOrConnectWithoutWeddingInput
    upsert?: WeddingInvitationUpsertWithoutWeddingInput
    disconnect?: WeddingInvitationWhereInput | boolean
    delete?: WeddingInvitationWhereInput | boolean
    connect?: WeddingInvitationWhereUniqueInput
    update?: XOR<XOR<WeddingInvitationUpdateToOneWithWhereWithoutWeddingInput, WeddingInvitationUpdateWithoutWeddingInput>, WeddingInvitationUncheckedUpdateWithoutWeddingInput>
  }

  export type WeddingCreateNestedOneWithoutWebsiteInput = {
    create?: XOR<WeddingCreateWithoutWebsiteInput, WeddingUncheckedCreateWithoutWebsiteInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutWebsiteInput
    connect?: WeddingWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type WeddingUpdateOneRequiredWithoutWebsiteNestedInput = {
    create?: XOR<WeddingCreateWithoutWebsiteInput, WeddingUncheckedCreateWithoutWebsiteInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutWebsiteInput
    upsert?: WeddingUpsertWithoutWebsiteInput
    connect?: WeddingWhereUniqueInput
    update?: XOR<XOR<WeddingUpdateToOneWithWhereWithoutWebsiteInput, WeddingUpdateWithoutWebsiteInput>, WeddingUncheckedUpdateWithoutWebsiteInput>
  }

  export type WeddingCreateNestedOneWithoutInvitationInput = {
    create?: XOR<WeddingCreateWithoutInvitationInput, WeddingUncheckedCreateWithoutInvitationInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutInvitationInput
    connect?: WeddingWhereUniqueInput
  }

  export type WeddingUpdateOneRequiredWithoutInvitationNestedInput = {
    create?: XOR<WeddingCreateWithoutInvitationInput, WeddingUncheckedCreateWithoutInvitationInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutInvitationInput
    upsert?: WeddingUpsertWithoutInvitationInput
    connect?: WeddingWhereUniqueInput
    update?: XOR<XOR<WeddingUpdateToOneWithWhereWithoutInvitationInput, WeddingUpdateWithoutInvitationInput>, WeddingUncheckedUpdateWithoutInvitationInput>
  }

  export type WeddingCreateNestedOneWithoutMembersInput = {
    create?: XOR<WeddingCreateWithoutMembersInput, WeddingUncheckedCreateWithoutMembersInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutMembersInput
    connect?: WeddingWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutWeddingMemberInput = {
    create?: XOR<UserCreateWithoutWeddingMemberInput, UserUncheckedCreateWithoutWeddingMemberInput>
    connectOrCreate?: UserCreateOrConnectWithoutWeddingMemberInput
    connect?: UserWhereUniqueInput
  }

  export type EnumWeddingMemberRoleFieldUpdateOperationsInput = {
    set?: $Enums.WeddingMemberRole
  }

  export type WeddingUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<WeddingCreateWithoutMembersInput, WeddingUncheckedCreateWithoutMembersInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutMembersInput
    upsert?: WeddingUpsertWithoutMembersInput
    connect?: WeddingWhereUniqueInput
    update?: XOR<XOR<WeddingUpdateToOneWithWhereWithoutMembersInput, WeddingUpdateWithoutMembersInput>, WeddingUncheckedUpdateWithoutMembersInput>
  }

  export type UserUpdateOneRequiredWithoutWeddingMemberNestedInput = {
    create?: XOR<UserCreateWithoutWeddingMemberInput, UserUncheckedCreateWithoutWeddingMemberInput>
    connectOrCreate?: UserCreateOrConnectWithoutWeddingMemberInput
    upsert?: UserUpsertWithoutWeddingMemberInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWeddingMemberInput, UserUpdateWithoutWeddingMemberInput>, UserUncheckedUpdateWithoutWeddingMemberInput>
  }

  export type WeddingCreateNestedOneWithoutInvitesInput = {
    create?: XOR<WeddingCreateWithoutInvitesInput, WeddingUncheckedCreateWithoutInvitesInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutInvitesInput
    connect?: WeddingWhereUniqueInput
  }

  export type WeddingUpdateOneRequiredWithoutInvitesNestedInput = {
    create?: XOR<WeddingCreateWithoutInvitesInput, WeddingUncheckedCreateWithoutInvitesInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutInvitesInput
    upsert?: WeddingUpsertWithoutInvitesInput
    connect?: WeddingWhereUniqueInput
    update?: XOR<XOR<WeddingUpdateToOneWithWhereWithoutInvitesInput, WeddingUpdateWithoutInvitesInput>, WeddingUncheckedUpdateWithoutInvitesInput>
  }

  export type WeddingCreateNestedOneWithoutTasksInput = {
    create?: XOR<WeddingCreateWithoutTasksInput, WeddingUncheckedCreateWithoutTasksInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutTasksInput
    connect?: WeddingWhereUniqueInput
  }

  export type EnumTaskStatusFieldUpdateOperationsInput = {
    set?: $Enums.TaskStatus
  }

  export type WeddingUpdateOneRequiredWithoutTasksNestedInput = {
    create?: XOR<WeddingCreateWithoutTasksInput, WeddingUncheckedCreateWithoutTasksInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutTasksInput
    upsert?: WeddingUpsertWithoutTasksInput
    connect?: WeddingWhereUniqueInput
    update?: XOR<XOR<WeddingUpdateToOneWithWhereWithoutTasksInput, WeddingUpdateWithoutTasksInput>, WeddingUncheckedUpdateWithoutTasksInput>
  }

  export type WeddingCreateNestedOneWithoutGuestListInput = {
    create?: XOR<WeddingCreateWithoutGuestListInput, WeddingUncheckedCreateWithoutGuestListInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutGuestListInput
    connect?: WeddingWhereUniqueInput
  }

  export type EnumGuestSideFieldUpdateOperationsInput = {
    set?: $Enums.GuestSide
  }

  export type EnumRsvpStatusFieldUpdateOperationsInput = {
    set?: $Enums.RsvpStatus
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type WeddingUpdateOneRequiredWithoutGuestListNestedInput = {
    create?: XOR<WeddingCreateWithoutGuestListInput, WeddingUncheckedCreateWithoutGuestListInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutGuestListInput
    upsert?: WeddingUpsertWithoutGuestListInput
    connect?: WeddingWhereUniqueInput
    update?: XOR<XOR<WeddingUpdateToOneWithWhereWithoutGuestListInput, WeddingUpdateWithoutGuestListInput>, WeddingUncheckedUpdateWithoutGuestListInput>
  }

  export type WeddingCreateNestedOneWithoutBudgetItemsInput = {
    create?: XOR<WeddingCreateWithoutBudgetItemsInput, WeddingUncheckedCreateWithoutBudgetItemsInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutBudgetItemsInput
    connect?: WeddingWhereUniqueInput
  }

  export type ExternalVendorCreateNestedOneWithoutBudgetItemInput = {
    create?: XOR<ExternalVendorCreateWithoutBudgetItemInput, ExternalVendorUncheckedCreateWithoutBudgetItemInput>
    connectOrCreate?: ExternalVendorCreateOrConnectWithoutBudgetItemInput
    connect?: ExternalVendorWhereUniqueInput
  }

  export type WeddingUpdateOneRequiredWithoutBudgetItemsNestedInput = {
    create?: XOR<WeddingCreateWithoutBudgetItemsInput, WeddingUncheckedCreateWithoutBudgetItemsInput>
    connectOrCreate?: WeddingCreateOrConnectWithoutBudgetItemsInput
    upsert?: WeddingUpsertWithoutBudgetItemsInput
    connect?: WeddingWhereUniqueInput
    update?: XOR<XOR<WeddingUpdateToOneWithWhereWithoutBudgetItemsInput, WeddingUpdateWithoutBudgetItemsInput>, WeddingUncheckedUpdateWithoutBudgetItemsInput>
  }

  export type ExternalVendorUpdateOneWithoutBudgetItemNestedInput = {
    create?: XOR<ExternalVendorCreateWithoutBudgetItemInput, ExternalVendorUncheckedCreateWithoutBudgetItemInput>
    connectOrCreate?: ExternalVendorCreateOrConnectWithoutBudgetItemInput
    upsert?: ExternalVendorUpsertWithoutBudgetItemInput
    disconnect?: ExternalVendorWhereInput | boolean
    delete?: ExternalVendorWhereInput | boolean
    connect?: ExternalVendorWhereUniqueInput
    update?: XOR<XOR<ExternalVendorUpdateToOneWithWhereWithoutBudgetItemInput, ExternalVendorUpdateWithoutBudgetItemInput>, ExternalVendorUncheckedUpdateWithoutBudgetItemInput>
  }

  export type ContentPostCreateNestedManyWithoutTopicInput = {
    create?: XOR<ContentPostCreateWithoutTopicInput, ContentPostUncheckedCreateWithoutTopicInput> | ContentPostCreateWithoutTopicInput[] | ContentPostUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: ContentPostCreateOrConnectWithoutTopicInput | ContentPostCreateOrConnectWithoutTopicInput[]
    createMany?: ContentPostCreateManyTopicInputEnvelope
    connect?: ContentPostWhereUniqueInput | ContentPostWhereUniqueInput[]
  }

  export type ContentPostUncheckedCreateNestedManyWithoutTopicInput = {
    create?: XOR<ContentPostCreateWithoutTopicInput, ContentPostUncheckedCreateWithoutTopicInput> | ContentPostCreateWithoutTopicInput[] | ContentPostUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: ContentPostCreateOrConnectWithoutTopicInput | ContentPostCreateOrConnectWithoutTopicInput[]
    createMany?: ContentPostCreateManyTopicInputEnvelope
    connect?: ContentPostWhereUniqueInput | ContentPostWhereUniqueInput[]
  }

  export type ContentPostUpdateManyWithoutTopicNestedInput = {
    create?: XOR<ContentPostCreateWithoutTopicInput, ContentPostUncheckedCreateWithoutTopicInput> | ContentPostCreateWithoutTopicInput[] | ContentPostUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: ContentPostCreateOrConnectWithoutTopicInput | ContentPostCreateOrConnectWithoutTopicInput[]
    upsert?: ContentPostUpsertWithWhereUniqueWithoutTopicInput | ContentPostUpsertWithWhereUniqueWithoutTopicInput[]
    createMany?: ContentPostCreateManyTopicInputEnvelope
    set?: ContentPostWhereUniqueInput | ContentPostWhereUniqueInput[]
    disconnect?: ContentPostWhereUniqueInput | ContentPostWhereUniqueInput[]
    delete?: ContentPostWhereUniqueInput | ContentPostWhereUniqueInput[]
    connect?: ContentPostWhereUniqueInput | ContentPostWhereUniqueInput[]
    update?: ContentPostUpdateWithWhereUniqueWithoutTopicInput | ContentPostUpdateWithWhereUniqueWithoutTopicInput[]
    updateMany?: ContentPostUpdateManyWithWhereWithoutTopicInput | ContentPostUpdateManyWithWhereWithoutTopicInput[]
    deleteMany?: ContentPostScalarWhereInput | ContentPostScalarWhereInput[]
  }

  export type ContentPostUncheckedUpdateManyWithoutTopicNestedInput = {
    create?: XOR<ContentPostCreateWithoutTopicInput, ContentPostUncheckedCreateWithoutTopicInput> | ContentPostCreateWithoutTopicInput[] | ContentPostUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: ContentPostCreateOrConnectWithoutTopicInput | ContentPostCreateOrConnectWithoutTopicInput[]
    upsert?: ContentPostUpsertWithWhereUniqueWithoutTopicInput | ContentPostUpsertWithWhereUniqueWithoutTopicInput[]
    createMany?: ContentPostCreateManyTopicInputEnvelope
    set?: ContentPostWhereUniqueInput | ContentPostWhereUniqueInput[]
    disconnect?: ContentPostWhereUniqueInput | ContentPostWhereUniqueInput[]
    delete?: ContentPostWhereUniqueInput | ContentPostWhereUniqueInput[]
    connect?: ContentPostWhereUniqueInput | ContentPostWhereUniqueInput[]
    update?: ContentPostUpdateWithWhereUniqueWithoutTopicInput | ContentPostUpdateWithWhereUniqueWithoutTopicInput[]
    updateMany?: ContentPostUpdateManyWithWhereWithoutTopicInput | ContentPostUpdateManyWithWhereWithoutTopicInput[]
    deleteMany?: ContentPostScalarWhereInput | ContentPostScalarWhereInput[]
  }

  export type ContentTopicCreateNestedOneWithoutPostsInput = {
    create?: XOR<ContentTopicCreateWithoutPostsInput, ContentTopicUncheckedCreateWithoutPostsInput>
    connectOrCreate?: ContentTopicCreateOrConnectWithoutPostsInput
    connect?: ContentTopicWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutContentPostsInput = {
    create?: XOR<UserCreateWithoutContentPostsInput, UserUncheckedCreateWithoutContentPostsInput>
    connectOrCreate?: UserCreateOrConnectWithoutContentPostsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumContentKindFieldUpdateOperationsInput = {
    set?: $Enums.ContentKind
  }

  export type EnumContentStatusFieldUpdateOperationsInput = {
    set?: $Enums.ContentStatus
  }

  export type ContentTopicUpdateOneRequiredWithoutPostsNestedInput = {
    create?: XOR<ContentTopicCreateWithoutPostsInput, ContentTopicUncheckedCreateWithoutPostsInput>
    connectOrCreate?: ContentTopicCreateOrConnectWithoutPostsInput
    upsert?: ContentTopicUpsertWithoutPostsInput
    connect?: ContentTopicWhereUniqueInput
    update?: XOR<XOR<ContentTopicUpdateToOneWithWhereWithoutPostsInput, ContentTopicUpdateWithoutPostsInput>, ContentTopicUncheckedUpdateWithoutPostsInput>
  }

  export type UserUpdateOneWithoutContentPostsNestedInput = {
    create?: XOR<UserCreateWithoutContentPostsInput, UserUncheckedCreateWithoutContentPostsInput>
    connectOrCreate?: UserCreateOrConnectWithoutContentPostsInput
    upsert?: UserUpsertWithoutContentPostsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutContentPostsInput, UserUpdateWithoutContentPostsInput>, UserUncheckedUpdateWithoutContentPostsInput>
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

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedEnumVendorPipelineStageFilter<$PrismaModel = never> = {
    equals?: $Enums.VendorPipelineStage | EnumVendorPipelineStageFieldRefInput<$PrismaModel>
    in?: $Enums.VendorPipelineStage[] | ListEnumVendorPipelineStageFieldRefInput<$PrismaModel>
    notIn?: $Enums.VendorPipelineStage[] | ListEnumVendorPipelineStageFieldRefInput<$PrismaModel>
    not?: NestedEnumVendorPipelineStageFilter<$PrismaModel> | $Enums.VendorPipelineStage
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumVendorPipelineStageWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VendorPipelineStage | EnumVendorPipelineStageFieldRefInput<$PrismaModel>
    in?: $Enums.VendorPipelineStage[] | ListEnumVendorPipelineStageFieldRefInput<$PrismaModel>
    notIn?: $Enums.VendorPipelineStage[] | ListEnumVendorPipelineStageFieldRefInput<$PrismaModel>
    not?: NestedEnumVendorPipelineStageWithAggregatesFilter<$PrismaModel> | $Enums.VendorPipelineStage
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVendorPipelineStageFilter<$PrismaModel>
    _max?: NestedEnumVendorPipelineStageFilter<$PrismaModel>
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
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
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

  export type NestedEnumWeddingMemberRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.WeddingMemberRole | EnumWeddingMemberRoleFieldRefInput<$PrismaModel>
    in?: $Enums.WeddingMemberRole[] | ListEnumWeddingMemberRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.WeddingMemberRole[] | ListEnumWeddingMemberRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumWeddingMemberRoleFilter<$PrismaModel> | $Enums.WeddingMemberRole
  }

  export type NestedEnumWeddingMemberRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WeddingMemberRole | EnumWeddingMemberRoleFieldRefInput<$PrismaModel>
    in?: $Enums.WeddingMemberRole[] | ListEnumWeddingMemberRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.WeddingMemberRole[] | ListEnumWeddingMemberRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumWeddingMemberRoleWithAggregatesFilter<$PrismaModel> | $Enums.WeddingMemberRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumWeddingMemberRoleFilter<$PrismaModel>
    _max?: NestedEnumWeddingMemberRoleFilter<$PrismaModel>
  }

  export type NestedEnumTaskStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusFilter<$PrismaModel> | $Enums.TaskStatus
  }

  export type NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel> | $Enums.TaskStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskStatusFilter<$PrismaModel>
    _max?: NestedEnumTaskStatusFilter<$PrismaModel>
  }

  export type NestedEnumGuestSideFilter<$PrismaModel = never> = {
    equals?: $Enums.GuestSide | EnumGuestSideFieldRefInput<$PrismaModel>
    in?: $Enums.GuestSide[] | ListEnumGuestSideFieldRefInput<$PrismaModel>
    notIn?: $Enums.GuestSide[] | ListEnumGuestSideFieldRefInput<$PrismaModel>
    not?: NestedEnumGuestSideFilter<$PrismaModel> | $Enums.GuestSide
  }

  export type NestedEnumRsvpStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RsvpStatus | EnumRsvpStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RsvpStatus[] | ListEnumRsvpStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RsvpStatus[] | ListEnumRsvpStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRsvpStatusFilter<$PrismaModel> | $Enums.RsvpStatus
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedEnumGuestSideWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GuestSide | EnumGuestSideFieldRefInput<$PrismaModel>
    in?: $Enums.GuestSide[] | ListEnumGuestSideFieldRefInput<$PrismaModel>
    notIn?: $Enums.GuestSide[] | ListEnumGuestSideFieldRefInput<$PrismaModel>
    not?: NestedEnumGuestSideWithAggregatesFilter<$PrismaModel> | $Enums.GuestSide
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGuestSideFilter<$PrismaModel>
    _max?: NestedEnumGuestSideFilter<$PrismaModel>
  }

  export type NestedEnumRsvpStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RsvpStatus | EnumRsvpStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RsvpStatus[] | ListEnumRsvpStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RsvpStatus[] | ListEnumRsvpStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRsvpStatusWithAggregatesFilter<$PrismaModel> | $Enums.RsvpStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRsvpStatusFilter<$PrismaModel>
    _max?: NestedEnumRsvpStatusFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedEnumContentKindFilter<$PrismaModel = never> = {
    equals?: $Enums.ContentKind | EnumContentKindFieldRefInput<$PrismaModel>
    in?: $Enums.ContentKind[] | ListEnumContentKindFieldRefInput<$PrismaModel>
    notIn?: $Enums.ContentKind[] | ListEnumContentKindFieldRefInput<$PrismaModel>
    not?: NestedEnumContentKindFilter<$PrismaModel> | $Enums.ContentKind
  }

  export type NestedEnumContentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ContentStatus | EnumContentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ContentStatus[] | ListEnumContentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ContentStatus[] | ListEnumContentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumContentStatusFilter<$PrismaModel> | $Enums.ContentStatus
  }

  export type NestedEnumContentKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ContentKind | EnumContentKindFieldRefInput<$PrismaModel>
    in?: $Enums.ContentKind[] | ListEnumContentKindFieldRefInput<$PrismaModel>
    notIn?: $Enums.ContentKind[] | ListEnumContentKindFieldRefInput<$PrismaModel>
    not?: NestedEnumContentKindWithAggregatesFilter<$PrismaModel> | $Enums.ContentKind
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumContentKindFilter<$PrismaModel>
    _max?: NestedEnumContentKindFilter<$PrismaModel>
  }

  export type NestedEnumContentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ContentStatus | EnumContentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ContentStatus[] | ListEnumContentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ContentStatus[] | ListEnumContentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumContentStatusWithAggregatesFilter<$PrismaModel> | $Enums.ContentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumContentStatusFilter<$PrismaModel>
    _max?: NestedEnumContentStatusFilter<$PrismaModel>
  }

  export type WeddingCreateWithoutUserInput = {
    id?: string
    date: Date | string
    city: string
    guests: number
    budget: number
    partnerOneName?: string
    partnerTwoName?: string
    couplePhotoUrl?: string | null
    planningStage?: string
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    members?: WeddingMemberCreateNestedManyWithoutWeddingInput
    invites?: WeddingInviteCreateNestedManyWithoutWeddingInput
    tasks?: TaskCreateNestedManyWithoutWeddingInput
    guestList?: GuestCreateNestedManyWithoutWeddingInput
    budgetItems?: BudgetItemCreateNestedManyWithoutWeddingInput
    website?: WeddingWebsiteCreateNestedOneWithoutWeddingInput
    invitation?: WeddingInvitationCreateNestedOneWithoutWeddingInput
  }

  export type WeddingUncheckedCreateWithoutUserInput = {
    id?: string
    date: Date | string
    city: string
    guests: number
    budget: number
    partnerOneName?: string
    partnerTwoName?: string
    couplePhotoUrl?: string | null
    planningStage?: string
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    members?: WeddingMemberUncheckedCreateNestedManyWithoutWeddingInput
    invites?: WeddingInviteUncheckedCreateNestedManyWithoutWeddingInput
    tasks?: TaskUncheckedCreateNestedManyWithoutWeddingInput
    guestList?: GuestUncheckedCreateNestedManyWithoutWeddingInput
    budgetItems?: BudgetItemUncheckedCreateNestedManyWithoutWeddingInput
    website?: WeddingWebsiteUncheckedCreateNestedOneWithoutWeddingInput
    invitation?: WeddingInvitationUncheckedCreateNestedOneWithoutWeddingInput
  }

  export type WeddingCreateOrConnectWithoutUserInput = {
    where: WeddingWhereUniqueInput
    create: XOR<WeddingCreateWithoutUserInput, WeddingUncheckedCreateWithoutUserInput>
  }

  export type WeddingMemberCreateWithoutUserInput = {
    id?: string
    role?: $Enums.WeddingMemberRole
    createdAt?: Date | string
    wedding: WeddingCreateNestedOneWithoutMembersInput
  }

  export type WeddingMemberUncheckedCreateWithoutUserInput = {
    id?: string
    weddingId: string
    role?: $Enums.WeddingMemberRole
    createdAt?: Date | string
  }

  export type WeddingMemberCreateOrConnectWithoutUserInput = {
    where: WeddingMemberWhereUniqueInput
    create: XOR<WeddingMemberCreateWithoutUserInput, WeddingMemberUncheckedCreateWithoutUserInput>
  }

  export type ExternalVendorCreateWithoutUserInput = {
    id?: string
    name: string
    category: string
    city: string
    phone?: string | null
    website?: string | null
    quotedPrice?: number | null
    notes?: string | null
    stage?: $Enums.VendorPipelineStage
    createdAt?: Date | string
    updatedAt?: Date | string
    budgetItem?: BudgetItemCreateNestedOneWithoutExternalVendorInput
  }

  export type ExternalVendorUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    category: string
    city: string
    phone?: string | null
    website?: string | null
    quotedPrice?: number | null
    notes?: string | null
    stage?: $Enums.VendorPipelineStage
    createdAt?: Date | string
    updatedAt?: Date | string
    budgetItem?: BudgetItemUncheckedCreateNestedOneWithoutExternalVendorInput
  }

  export type ExternalVendorCreateOrConnectWithoutUserInput = {
    where: ExternalVendorWhereUniqueInput
    create: XOR<ExternalVendorCreateWithoutUserInput, ExternalVendorUncheckedCreateWithoutUserInput>
  }

  export type ExternalVendorCreateManyUserInputEnvelope = {
    data: ExternalVendorCreateManyUserInput | ExternalVendorCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ContentPostCreateWithoutAuthorInput = {
    id?: string
    title: string
    slug: string
    excerpt?: string
    coverUrl?: string | null
    kind?: $Enums.ContentKind
    status?: $Enums.ContentStatus
    body?: JsonNullValueInput | InputJsonValue
    seoTitle?: string
    seoDescription?: string
    ogImageUrl?: string | null
    city?: string | null
    featured?: boolean
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    topic: ContentTopicCreateNestedOneWithoutPostsInput
  }

  export type ContentPostUncheckedCreateWithoutAuthorInput = {
    id?: string
    title: string
    slug: string
    excerpt?: string
    coverUrl?: string | null
    kind?: $Enums.ContentKind
    status?: $Enums.ContentStatus
    body?: JsonNullValueInput | InputJsonValue
    seoTitle?: string
    seoDescription?: string
    ogImageUrl?: string | null
    city?: string | null
    featured?: boolean
    topicId: string
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContentPostCreateOrConnectWithoutAuthorInput = {
    where: ContentPostWhereUniqueInput
    create: XOR<ContentPostCreateWithoutAuthorInput, ContentPostUncheckedCreateWithoutAuthorInput>
  }

  export type ContentPostCreateManyAuthorInputEnvelope = {
    data: ContentPostCreateManyAuthorInput | ContentPostCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type PushDeviceCreateWithoutUserInput = {
    id?: string
    token: string
    platform?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PushDeviceUncheckedCreateWithoutUserInput = {
    id?: string
    token: string
    platform?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PushDeviceCreateOrConnectWithoutUserInput = {
    where: PushDeviceWhereUniqueInput
    create: XOR<PushDeviceCreateWithoutUserInput, PushDeviceUncheckedCreateWithoutUserInput>
  }

  export type PushDeviceCreateManyUserInputEnvelope = {
    data: PushDeviceCreateManyUserInput | PushDeviceCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type WeddingUpsertWithoutUserInput = {
    update: XOR<WeddingUpdateWithoutUserInput, WeddingUncheckedUpdateWithoutUserInput>
    create: XOR<WeddingCreateWithoutUserInput, WeddingUncheckedCreateWithoutUserInput>
    where?: WeddingWhereInput
  }

  export type WeddingUpdateToOneWithWhereWithoutUserInput = {
    where?: WeddingWhereInput
    data: XOR<WeddingUpdateWithoutUserInput, WeddingUncheckedUpdateWithoutUserInput>
  }

  export type WeddingUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    guests?: IntFieldUpdateOperationsInput | number
    budget?: IntFieldUpdateOperationsInput | number
    partnerOneName?: StringFieldUpdateOperationsInput | string
    partnerTwoName?: StringFieldUpdateOperationsInput | string
    couplePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    planningStage?: StringFieldUpdateOperationsInput | string
    cityUndecided?: BoolFieldUpdateOperationsInput | boolean
    guestsUndecided?: BoolFieldUpdateOperationsInput | boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    members?: WeddingMemberUpdateManyWithoutWeddingNestedInput
    invites?: WeddingInviteUpdateManyWithoutWeddingNestedInput
    tasks?: TaskUpdateManyWithoutWeddingNestedInput
    guestList?: GuestUpdateManyWithoutWeddingNestedInput
    budgetItems?: BudgetItemUpdateManyWithoutWeddingNestedInput
    website?: WeddingWebsiteUpdateOneWithoutWeddingNestedInput
    invitation?: WeddingInvitationUpdateOneWithoutWeddingNestedInput
  }

  export type WeddingUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    guests?: IntFieldUpdateOperationsInput | number
    budget?: IntFieldUpdateOperationsInput | number
    partnerOneName?: StringFieldUpdateOperationsInput | string
    partnerTwoName?: StringFieldUpdateOperationsInput | string
    couplePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    planningStage?: StringFieldUpdateOperationsInput | string
    cityUndecided?: BoolFieldUpdateOperationsInput | boolean
    guestsUndecided?: BoolFieldUpdateOperationsInput | boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    members?: WeddingMemberUncheckedUpdateManyWithoutWeddingNestedInput
    invites?: WeddingInviteUncheckedUpdateManyWithoutWeddingNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutWeddingNestedInput
    guestList?: GuestUncheckedUpdateManyWithoutWeddingNestedInput
    budgetItems?: BudgetItemUncheckedUpdateManyWithoutWeddingNestedInput
    website?: WeddingWebsiteUncheckedUpdateOneWithoutWeddingNestedInput
    invitation?: WeddingInvitationUncheckedUpdateOneWithoutWeddingNestedInput
  }

  export type WeddingMemberUpsertWithoutUserInput = {
    update: XOR<WeddingMemberUpdateWithoutUserInput, WeddingMemberUncheckedUpdateWithoutUserInput>
    create: XOR<WeddingMemberCreateWithoutUserInput, WeddingMemberUncheckedCreateWithoutUserInput>
    where?: WeddingMemberWhereInput
  }

  export type WeddingMemberUpdateToOneWithWhereWithoutUserInput = {
    where?: WeddingMemberWhereInput
    data: XOR<WeddingMemberUpdateWithoutUserInput, WeddingMemberUncheckedUpdateWithoutUserInput>
  }

  export type WeddingMemberUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumWeddingMemberRoleFieldUpdateOperationsInput | $Enums.WeddingMemberRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wedding?: WeddingUpdateOneRequiredWithoutMembersNestedInput
  }

  export type WeddingMemberUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    weddingId?: StringFieldUpdateOperationsInput | string
    role?: EnumWeddingMemberRoleFieldUpdateOperationsInput | $Enums.WeddingMemberRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExternalVendorUpsertWithWhereUniqueWithoutUserInput = {
    where: ExternalVendorWhereUniqueInput
    update: XOR<ExternalVendorUpdateWithoutUserInput, ExternalVendorUncheckedUpdateWithoutUserInput>
    create: XOR<ExternalVendorCreateWithoutUserInput, ExternalVendorUncheckedCreateWithoutUserInput>
  }

  export type ExternalVendorUpdateWithWhereUniqueWithoutUserInput = {
    where: ExternalVendorWhereUniqueInput
    data: XOR<ExternalVendorUpdateWithoutUserInput, ExternalVendorUncheckedUpdateWithoutUserInput>
  }

  export type ExternalVendorUpdateManyWithWhereWithoutUserInput = {
    where: ExternalVendorScalarWhereInput
    data: XOR<ExternalVendorUpdateManyMutationInput, ExternalVendorUncheckedUpdateManyWithoutUserInput>
  }

  export type ExternalVendorScalarWhereInput = {
    AND?: ExternalVendorScalarWhereInput | ExternalVendorScalarWhereInput[]
    OR?: ExternalVendorScalarWhereInput[]
    NOT?: ExternalVendorScalarWhereInput | ExternalVendorScalarWhereInput[]
    id?: StringFilter<"ExternalVendor"> | string
    userId?: StringFilter<"ExternalVendor"> | string
    name?: StringFilter<"ExternalVendor"> | string
    category?: StringFilter<"ExternalVendor"> | string
    city?: StringFilter<"ExternalVendor"> | string
    phone?: StringNullableFilter<"ExternalVendor"> | string | null
    website?: StringNullableFilter<"ExternalVendor"> | string | null
    quotedPrice?: IntNullableFilter<"ExternalVendor"> | number | null
    notes?: StringNullableFilter<"ExternalVendor"> | string | null
    stage?: EnumVendorPipelineStageFilter<"ExternalVendor"> | $Enums.VendorPipelineStage
    createdAt?: DateTimeFilter<"ExternalVendor"> | Date | string
    updatedAt?: DateTimeFilter<"ExternalVendor"> | Date | string
  }

  export type ContentPostUpsertWithWhereUniqueWithoutAuthorInput = {
    where: ContentPostWhereUniqueInput
    update: XOR<ContentPostUpdateWithoutAuthorInput, ContentPostUncheckedUpdateWithoutAuthorInput>
    create: XOR<ContentPostCreateWithoutAuthorInput, ContentPostUncheckedCreateWithoutAuthorInput>
  }

  export type ContentPostUpdateWithWhereUniqueWithoutAuthorInput = {
    where: ContentPostWhereUniqueInput
    data: XOR<ContentPostUpdateWithoutAuthorInput, ContentPostUncheckedUpdateWithoutAuthorInput>
  }

  export type ContentPostUpdateManyWithWhereWithoutAuthorInput = {
    where: ContentPostScalarWhereInput
    data: XOR<ContentPostUpdateManyMutationInput, ContentPostUncheckedUpdateManyWithoutAuthorInput>
  }

  export type ContentPostScalarWhereInput = {
    AND?: ContentPostScalarWhereInput | ContentPostScalarWhereInput[]
    OR?: ContentPostScalarWhereInput[]
    NOT?: ContentPostScalarWhereInput | ContentPostScalarWhereInput[]
    id?: StringFilter<"ContentPost"> | string
    title?: StringFilter<"ContentPost"> | string
    slug?: StringFilter<"ContentPost"> | string
    excerpt?: StringFilter<"ContentPost"> | string
    coverUrl?: StringNullableFilter<"ContentPost"> | string | null
    kind?: EnumContentKindFilter<"ContentPost"> | $Enums.ContentKind
    status?: EnumContentStatusFilter<"ContentPost"> | $Enums.ContentStatus
    body?: JsonFilter<"ContentPost">
    seoTitle?: StringFilter<"ContentPost"> | string
    seoDescription?: StringFilter<"ContentPost"> | string
    ogImageUrl?: StringNullableFilter<"ContentPost"> | string | null
    city?: StringNullableFilter<"ContentPost"> | string | null
    featured?: BoolFilter<"ContentPost"> | boolean
    topicId?: StringFilter<"ContentPost"> | string
    authorId?: StringNullableFilter<"ContentPost"> | string | null
    publishedAt?: DateTimeNullableFilter<"ContentPost"> | Date | string | null
    createdAt?: DateTimeFilter<"ContentPost"> | Date | string
    updatedAt?: DateTimeFilter<"ContentPost"> | Date | string
  }

  export type PushDeviceUpsertWithWhereUniqueWithoutUserInput = {
    where: PushDeviceWhereUniqueInput
    update: XOR<PushDeviceUpdateWithoutUserInput, PushDeviceUncheckedUpdateWithoutUserInput>
    create: XOR<PushDeviceCreateWithoutUserInput, PushDeviceUncheckedCreateWithoutUserInput>
  }

  export type PushDeviceUpdateWithWhereUniqueWithoutUserInput = {
    where: PushDeviceWhereUniqueInput
    data: XOR<PushDeviceUpdateWithoutUserInput, PushDeviceUncheckedUpdateWithoutUserInput>
  }

  export type PushDeviceUpdateManyWithWhereWithoutUserInput = {
    where: PushDeviceScalarWhereInput
    data: XOR<PushDeviceUpdateManyMutationInput, PushDeviceUncheckedUpdateManyWithoutUserInput>
  }

  export type PushDeviceScalarWhereInput = {
    AND?: PushDeviceScalarWhereInput | PushDeviceScalarWhereInput[]
    OR?: PushDeviceScalarWhereInput[]
    NOT?: PushDeviceScalarWhereInput | PushDeviceScalarWhereInput[]
    id?: StringFilter<"PushDevice"> | string
    userId?: StringFilter<"PushDevice"> | string
    token?: StringFilter<"PushDevice"> | string
    platform?: StringFilter<"PushDevice"> | string
    createdAt?: DateTimeFilter<"PushDevice"> | Date | string
    updatedAt?: DateTimeFilter<"PushDevice"> | Date | string
  }

  export type UserCreateWithoutPushDevicesInput = {
    id?: string
    email: string
    password: string
    name: string
    role?: $Enums.Role
    blocked?: boolean
    refreshTokenHash?: string | null
    createdAt?: Date | string
    wedding?: WeddingCreateNestedOneWithoutUserInput
    weddingMember?: WeddingMemberCreateNestedOneWithoutUserInput
    externalVendors?: ExternalVendorCreateNestedManyWithoutUserInput
    contentPosts?: ContentPostCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateWithoutPushDevicesInput = {
    id?: string
    email: string
    password: string
    name: string
    role?: $Enums.Role
    blocked?: boolean
    refreshTokenHash?: string | null
    createdAt?: Date | string
    wedding?: WeddingUncheckedCreateNestedOneWithoutUserInput
    weddingMember?: WeddingMemberUncheckedCreateNestedOneWithoutUserInput
    externalVendors?: ExternalVendorUncheckedCreateNestedManyWithoutUserInput
    contentPosts?: ContentPostUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserCreateOrConnectWithoutPushDevicesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPushDevicesInput, UserUncheckedCreateWithoutPushDevicesInput>
  }

  export type UserUpsertWithoutPushDevicesInput = {
    update: XOR<UserUpdateWithoutPushDevicesInput, UserUncheckedUpdateWithoutPushDevicesInput>
    create: XOR<UserCreateWithoutPushDevicesInput, UserUncheckedCreateWithoutPushDevicesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPushDevicesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPushDevicesInput, UserUncheckedUpdateWithoutPushDevicesInput>
  }

  export type UserUpdateWithoutPushDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    blocked?: BoolFieldUpdateOperationsInput | boolean
    refreshTokenHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wedding?: WeddingUpdateOneWithoutUserNestedInput
    weddingMember?: WeddingMemberUpdateOneWithoutUserNestedInput
    externalVendors?: ExternalVendorUpdateManyWithoutUserNestedInput
    contentPosts?: ContentPostUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateWithoutPushDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    blocked?: BoolFieldUpdateOperationsInput | boolean
    refreshTokenHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wedding?: WeddingUncheckedUpdateOneWithoutUserNestedInput
    weddingMember?: WeddingMemberUncheckedUpdateOneWithoutUserNestedInput
    externalVendors?: ExternalVendorUncheckedUpdateManyWithoutUserNestedInput
    contentPosts?: ContentPostUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type UserCreateWithoutExternalVendorsInput = {
    id?: string
    email: string
    password: string
    name: string
    role?: $Enums.Role
    blocked?: boolean
    refreshTokenHash?: string | null
    createdAt?: Date | string
    wedding?: WeddingCreateNestedOneWithoutUserInput
    weddingMember?: WeddingMemberCreateNestedOneWithoutUserInput
    contentPosts?: ContentPostCreateNestedManyWithoutAuthorInput
    pushDevices?: PushDeviceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutExternalVendorsInput = {
    id?: string
    email: string
    password: string
    name: string
    role?: $Enums.Role
    blocked?: boolean
    refreshTokenHash?: string | null
    createdAt?: Date | string
    wedding?: WeddingUncheckedCreateNestedOneWithoutUserInput
    weddingMember?: WeddingMemberUncheckedCreateNestedOneWithoutUserInput
    contentPosts?: ContentPostUncheckedCreateNestedManyWithoutAuthorInput
    pushDevices?: PushDeviceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutExternalVendorsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutExternalVendorsInput, UserUncheckedCreateWithoutExternalVendorsInput>
  }

  export type BudgetItemCreateWithoutExternalVendorInput = {
    id?: string
    category: string
    title: string
    estimated?: number
    actual?: number
    paid?: boolean
    notes?: string | null
    createdAt?: Date | string
    wedding: WeddingCreateNestedOneWithoutBudgetItemsInput
  }

  export type BudgetItemUncheckedCreateWithoutExternalVendorInput = {
    id?: string
    weddingId: string
    category: string
    title: string
    estimated?: number
    actual?: number
    paid?: boolean
    notes?: string | null
    createdAt?: Date | string
  }

  export type BudgetItemCreateOrConnectWithoutExternalVendorInput = {
    where: BudgetItemWhereUniqueInput
    create: XOR<BudgetItemCreateWithoutExternalVendorInput, BudgetItemUncheckedCreateWithoutExternalVendorInput>
  }

  export type UserUpsertWithoutExternalVendorsInput = {
    update: XOR<UserUpdateWithoutExternalVendorsInput, UserUncheckedUpdateWithoutExternalVendorsInput>
    create: XOR<UserCreateWithoutExternalVendorsInput, UserUncheckedCreateWithoutExternalVendorsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutExternalVendorsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutExternalVendorsInput, UserUncheckedUpdateWithoutExternalVendorsInput>
  }

  export type UserUpdateWithoutExternalVendorsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    blocked?: BoolFieldUpdateOperationsInput | boolean
    refreshTokenHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wedding?: WeddingUpdateOneWithoutUserNestedInput
    weddingMember?: WeddingMemberUpdateOneWithoutUserNestedInput
    contentPosts?: ContentPostUpdateManyWithoutAuthorNestedInput
    pushDevices?: PushDeviceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutExternalVendorsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    blocked?: BoolFieldUpdateOperationsInput | boolean
    refreshTokenHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wedding?: WeddingUncheckedUpdateOneWithoutUserNestedInput
    weddingMember?: WeddingMemberUncheckedUpdateOneWithoutUserNestedInput
    contentPosts?: ContentPostUncheckedUpdateManyWithoutAuthorNestedInput
    pushDevices?: PushDeviceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type BudgetItemUpsertWithoutExternalVendorInput = {
    update: XOR<BudgetItemUpdateWithoutExternalVendorInput, BudgetItemUncheckedUpdateWithoutExternalVendorInput>
    create: XOR<BudgetItemCreateWithoutExternalVendorInput, BudgetItemUncheckedCreateWithoutExternalVendorInput>
    where?: BudgetItemWhereInput
  }

  export type BudgetItemUpdateToOneWithWhereWithoutExternalVendorInput = {
    where?: BudgetItemWhereInput
    data: XOR<BudgetItemUpdateWithoutExternalVendorInput, BudgetItemUncheckedUpdateWithoutExternalVendorInput>
  }

  export type BudgetItemUpdateWithoutExternalVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    estimated?: IntFieldUpdateOperationsInput | number
    actual?: IntFieldUpdateOperationsInput | number
    paid?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wedding?: WeddingUpdateOneRequiredWithoutBudgetItemsNestedInput
  }

  export type BudgetItemUncheckedUpdateWithoutExternalVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    weddingId?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    estimated?: IntFieldUpdateOperationsInput | number
    actual?: IntFieldUpdateOperationsInput | number
    paid?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutWeddingInput = {
    id?: string
    email: string
    password: string
    name: string
    role?: $Enums.Role
    blocked?: boolean
    refreshTokenHash?: string | null
    createdAt?: Date | string
    weddingMember?: WeddingMemberCreateNestedOneWithoutUserInput
    externalVendors?: ExternalVendorCreateNestedManyWithoutUserInput
    contentPosts?: ContentPostCreateNestedManyWithoutAuthorInput
    pushDevices?: PushDeviceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutWeddingInput = {
    id?: string
    email: string
    password: string
    name: string
    role?: $Enums.Role
    blocked?: boolean
    refreshTokenHash?: string | null
    createdAt?: Date | string
    weddingMember?: WeddingMemberUncheckedCreateNestedOneWithoutUserInput
    externalVendors?: ExternalVendorUncheckedCreateNestedManyWithoutUserInput
    contentPosts?: ContentPostUncheckedCreateNestedManyWithoutAuthorInput
    pushDevices?: PushDeviceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutWeddingInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWeddingInput, UserUncheckedCreateWithoutWeddingInput>
  }

  export type WeddingMemberCreateWithoutWeddingInput = {
    id?: string
    role?: $Enums.WeddingMemberRole
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutWeddingMemberInput
  }

  export type WeddingMemberUncheckedCreateWithoutWeddingInput = {
    id?: string
    userId: string
    role?: $Enums.WeddingMemberRole
    createdAt?: Date | string
  }

  export type WeddingMemberCreateOrConnectWithoutWeddingInput = {
    where: WeddingMemberWhereUniqueInput
    create: XOR<WeddingMemberCreateWithoutWeddingInput, WeddingMemberUncheckedCreateWithoutWeddingInput>
  }

  export type WeddingMemberCreateManyWeddingInputEnvelope = {
    data: WeddingMemberCreateManyWeddingInput | WeddingMemberCreateManyWeddingInput[]
    skipDuplicates?: boolean
  }

  export type WeddingInviteCreateWithoutWeddingInput = {
    id?: string
    token?: string
    expiresAt: Date | string
    acceptedAt?: Date | string | null
    acceptedBy?: string | null
    createdAt?: Date | string
  }

  export type WeddingInviteUncheckedCreateWithoutWeddingInput = {
    id?: string
    token?: string
    expiresAt: Date | string
    acceptedAt?: Date | string | null
    acceptedBy?: string | null
    createdAt?: Date | string
  }

  export type WeddingInviteCreateOrConnectWithoutWeddingInput = {
    where: WeddingInviteWhereUniqueInput
    create: XOR<WeddingInviteCreateWithoutWeddingInput, WeddingInviteUncheckedCreateWithoutWeddingInput>
  }

  export type WeddingInviteCreateManyWeddingInputEnvelope = {
    data: WeddingInviteCreateManyWeddingInput | WeddingInviteCreateManyWeddingInput[]
    skipDuplicates?: boolean
  }

  export type TaskCreateWithoutWeddingInput = {
    id?: string
    title: string
    categorySlug?: string | null
    status?: $Enums.TaskStatus
    dueDate?: Date | string | null
    dueRemindedAt?: Date | string | null
    sortOrder?: number
    isCustom?: boolean
    assignee?: string | null
  }

  export type TaskUncheckedCreateWithoutWeddingInput = {
    id?: string
    title: string
    categorySlug?: string | null
    status?: $Enums.TaskStatus
    dueDate?: Date | string | null
    dueRemindedAt?: Date | string | null
    sortOrder?: number
    isCustom?: boolean
    assignee?: string | null
  }

  export type TaskCreateOrConnectWithoutWeddingInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutWeddingInput, TaskUncheckedCreateWithoutWeddingInput>
  }

  export type TaskCreateManyWeddingInputEnvelope = {
    data: TaskCreateManyWeddingInput | TaskCreateManyWeddingInput[]
    skipDuplicates?: boolean
  }

  export type GuestCreateWithoutWeddingInput = {
    id?: string
    name: string
    email?: string | null
    phone?: string | null
    side?: $Enums.GuestSide
    rsvpStatus?: $Enums.RsvpStatus
    plusOne?: boolean
    plusOneName?: string | null
    plusOneAttending?: boolean | null
    allergies?: string | null
    tableLabel?: string | null
    notes?: string | null
    inviteToken?: string
    respondedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type GuestUncheckedCreateWithoutWeddingInput = {
    id?: string
    name: string
    email?: string | null
    phone?: string | null
    side?: $Enums.GuestSide
    rsvpStatus?: $Enums.RsvpStatus
    plusOne?: boolean
    plusOneName?: string | null
    plusOneAttending?: boolean | null
    allergies?: string | null
    tableLabel?: string | null
    notes?: string | null
    inviteToken?: string
    respondedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type GuestCreateOrConnectWithoutWeddingInput = {
    where: GuestWhereUniqueInput
    create: XOR<GuestCreateWithoutWeddingInput, GuestUncheckedCreateWithoutWeddingInput>
  }

  export type GuestCreateManyWeddingInputEnvelope = {
    data: GuestCreateManyWeddingInput | GuestCreateManyWeddingInput[]
    skipDuplicates?: boolean
  }

  export type BudgetItemCreateWithoutWeddingInput = {
    id?: string
    category: string
    title: string
    estimated?: number
    actual?: number
    paid?: boolean
    notes?: string | null
    createdAt?: Date | string
    externalVendor?: ExternalVendorCreateNestedOneWithoutBudgetItemInput
  }

  export type BudgetItemUncheckedCreateWithoutWeddingInput = {
    id?: string
    category: string
    title: string
    estimated?: number
    actual?: number
    paid?: boolean
    notes?: string | null
    externalVendorId?: string | null
    createdAt?: Date | string
  }

  export type BudgetItemCreateOrConnectWithoutWeddingInput = {
    where: BudgetItemWhereUniqueInput
    create: XOR<BudgetItemCreateWithoutWeddingInput, BudgetItemUncheckedCreateWithoutWeddingInput>
  }

  export type BudgetItemCreateManyWeddingInputEnvelope = {
    data: BudgetItemCreateManyWeddingInput | BudgetItemCreateManyWeddingInput[]
    skipDuplicates?: boolean
  }

  export type WeddingWebsiteCreateWithoutWeddingInput = {
    id?: string
    slug: string
    templateId?: string
    published?: boolean
    publishedAt?: Date | string | null
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WeddingWebsiteUncheckedCreateWithoutWeddingInput = {
    id?: string
    slug: string
    templateId?: string
    published?: boolean
    publishedAt?: Date | string | null
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WeddingWebsiteCreateOrConnectWithoutWeddingInput = {
    where: WeddingWebsiteWhereUniqueInput
    create: XOR<WeddingWebsiteCreateWithoutWeddingInput, WeddingWebsiteUncheckedCreateWithoutWeddingInput>
  }

  export type WeddingInvitationCreateWithoutWeddingInput = {
    id?: string
    templateId?: string
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WeddingInvitationUncheckedCreateWithoutWeddingInput = {
    id?: string
    templateId?: string
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WeddingInvitationCreateOrConnectWithoutWeddingInput = {
    where: WeddingInvitationWhereUniqueInput
    create: XOR<WeddingInvitationCreateWithoutWeddingInput, WeddingInvitationUncheckedCreateWithoutWeddingInput>
  }

  export type UserUpsertWithoutWeddingInput = {
    update: XOR<UserUpdateWithoutWeddingInput, UserUncheckedUpdateWithoutWeddingInput>
    create: XOR<UserCreateWithoutWeddingInput, UserUncheckedCreateWithoutWeddingInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWeddingInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWeddingInput, UserUncheckedUpdateWithoutWeddingInput>
  }

  export type UserUpdateWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    blocked?: BoolFieldUpdateOperationsInput | boolean
    refreshTokenHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    weddingMember?: WeddingMemberUpdateOneWithoutUserNestedInput
    externalVendors?: ExternalVendorUpdateManyWithoutUserNestedInput
    contentPosts?: ContentPostUpdateManyWithoutAuthorNestedInput
    pushDevices?: PushDeviceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    blocked?: BoolFieldUpdateOperationsInput | boolean
    refreshTokenHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    weddingMember?: WeddingMemberUncheckedUpdateOneWithoutUserNestedInput
    externalVendors?: ExternalVendorUncheckedUpdateManyWithoutUserNestedInput
    contentPosts?: ContentPostUncheckedUpdateManyWithoutAuthorNestedInput
    pushDevices?: PushDeviceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type WeddingMemberUpsertWithWhereUniqueWithoutWeddingInput = {
    where: WeddingMemberWhereUniqueInput
    update: XOR<WeddingMemberUpdateWithoutWeddingInput, WeddingMemberUncheckedUpdateWithoutWeddingInput>
    create: XOR<WeddingMemberCreateWithoutWeddingInput, WeddingMemberUncheckedCreateWithoutWeddingInput>
  }

  export type WeddingMemberUpdateWithWhereUniqueWithoutWeddingInput = {
    where: WeddingMemberWhereUniqueInput
    data: XOR<WeddingMemberUpdateWithoutWeddingInput, WeddingMemberUncheckedUpdateWithoutWeddingInput>
  }

  export type WeddingMemberUpdateManyWithWhereWithoutWeddingInput = {
    where: WeddingMemberScalarWhereInput
    data: XOR<WeddingMemberUpdateManyMutationInput, WeddingMemberUncheckedUpdateManyWithoutWeddingInput>
  }

  export type WeddingMemberScalarWhereInput = {
    AND?: WeddingMemberScalarWhereInput | WeddingMemberScalarWhereInput[]
    OR?: WeddingMemberScalarWhereInput[]
    NOT?: WeddingMemberScalarWhereInput | WeddingMemberScalarWhereInput[]
    id?: StringFilter<"WeddingMember"> | string
    weddingId?: StringFilter<"WeddingMember"> | string
    userId?: StringFilter<"WeddingMember"> | string
    role?: EnumWeddingMemberRoleFilter<"WeddingMember"> | $Enums.WeddingMemberRole
    createdAt?: DateTimeFilter<"WeddingMember"> | Date | string
  }

  export type WeddingInviteUpsertWithWhereUniqueWithoutWeddingInput = {
    where: WeddingInviteWhereUniqueInput
    update: XOR<WeddingInviteUpdateWithoutWeddingInput, WeddingInviteUncheckedUpdateWithoutWeddingInput>
    create: XOR<WeddingInviteCreateWithoutWeddingInput, WeddingInviteUncheckedCreateWithoutWeddingInput>
  }

  export type WeddingInviteUpdateWithWhereUniqueWithoutWeddingInput = {
    where: WeddingInviteWhereUniqueInput
    data: XOR<WeddingInviteUpdateWithoutWeddingInput, WeddingInviteUncheckedUpdateWithoutWeddingInput>
  }

  export type WeddingInviteUpdateManyWithWhereWithoutWeddingInput = {
    where: WeddingInviteScalarWhereInput
    data: XOR<WeddingInviteUpdateManyMutationInput, WeddingInviteUncheckedUpdateManyWithoutWeddingInput>
  }

  export type WeddingInviteScalarWhereInput = {
    AND?: WeddingInviteScalarWhereInput | WeddingInviteScalarWhereInput[]
    OR?: WeddingInviteScalarWhereInput[]
    NOT?: WeddingInviteScalarWhereInput | WeddingInviteScalarWhereInput[]
    id?: StringFilter<"WeddingInvite"> | string
    weddingId?: StringFilter<"WeddingInvite"> | string
    token?: StringFilter<"WeddingInvite"> | string
    expiresAt?: DateTimeFilter<"WeddingInvite"> | Date | string
    acceptedAt?: DateTimeNullableFilter<"WeddingInvite"> | Date | string | null
    acceptedBy?: StringNullableFilter<"WeddingInvite"> | string | null
    createdAt?: DateTimeFilter<"WeddingInvite"> | Date | string
  }

  export type TaskUpsertWithWhereUniqueWithoutWeddingInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutWeddingInput, TaskUncheckedUpdateWithoutWeddingInput>
    create: XOR<TaskCreateWithoutWeddingInput, TaskUncheckedCreateWithoutWeddingInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutWeddingInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutWeddingInput, TaskUncheckedUpdateWithoutWeddingInput>
  }

  export type TaskUpdateManyWithWhereWithoutWeddingInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutWeddingInput>
  }

  export type TaskScalarWhereInput = {
    AND?: TaskScalarWhereInput | TaskScalarWhereInput[]
    OR?: TaskScalarWhereInput[]
    NOT?: TaskScalarWhereInput | TaskScalarWhereInput[]
    id?: StringFilter<"Task"> | string
    weddingId?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    categorySlug?: StringNullableFilter<"Task"> | string | null
    status?: EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus
    dueDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    dueRemindedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    sortOrder?: IntFilter<"Task"> | number
    isCustom?: BoolFilter<"Task"> | boolean
    assignee?: StringNullableFilter<"Task"> | string | null
  }

  export type GuestUpsertWithWhereUniqueWithoutWeddingInput = {
    where: GuestWhereUniqueInput
    update: XOR<GuestUpdateWithoutWeddingInput, GuestUncheckedUpdateWithoutWeddingInput>
    create: XOR<GuestCreateWithoutWeddingInput, GuestUncheckedCreateWithoutWeddingInput>
  }

  export type GuestUpdateWithWhereUniqueWithoutWeddingInput = {
    where: GuestWhereUniqueInput
    data: XOR<GuestUpdateWithoutWeddingInput, GuestUncheckedUpdateWithoutWeddingInput>
  }

  export type GuestUpdateManyWithWhereWithoutWeddingInput = {
    where: GuestScalarWhereInput
    data: XOR<GuestUpdateManyMutationInput, GuestUncheckedUpdateManyWithoutWeddingInput>
  }

  export type GuestScalarWhereInput = {
    AND?: GuestScalarWhereInput | GuestScalarWhereInput[]
    OR?: GuestScalarWhereInput[]
    NOT?: GuestScalarWhereInput | GuestScalarWhereInput[]
    id?: StringFilter<"Guest"> | string
    weddingId?: StringFilter<"Guest"> | string
    name?: StringFilter<"Guest"> | string
    email?: StringNullableFilter<"Guest"> | string | null
    phone?: StringNullableFilter<"Guest"> | string | null
    side?: EnumGuestSideFilter<"Guest"> | $Enums.GuestSide
    rsvpStatus?: EnumRsvpStatusFilter<"Guest"> | $Enums.RsvpStatus
    plusOne?: BoolFilter<"Guest"> | boolean
    plusOneName?: StringNullableFilter<"Guest"> | string | null
    plusOneAttending?: BoolNullableFilter<"Guest"> | boolean | null
    allergies?: StringNullableFilter<"Guest"> | string | null
    tableLabel?: StringNullableFilter<"Guest"> | string | null
    notes?: StringNullableFilter<"Guest"> | string | null
    inviteToken?: StringFilter<"Guest"> | string
    respondedAt?: DateTimeNullableFilter<"Guest"> | Date | string | null
    createdAt?: DateTimeFilter<"Guest"> | Date | string
  }

  export type BudgetItemUpsertWithWhereUniqueWithoutWeddingInput = {
    where: BudgetItemWhereUniqueInput
    update: XOR<BudgetItemUpdateWithoutWeddingInput, BudgetItemUncheckedUpdateWithoutWeddingInput>
    create: XOR<BudgetItemCreateWithoutWeddingInput, BudgetItemUncheckedCreateWithoutWeddingInput>
  }

  export type BudgetItemUpdateWithWhereUniqueWithoutWeddingInput = {
    where: BudgetItemWhereUniqueInput
    data: XOR<BudgetItemUpdateWithoutWeddingInput, BudgetItemUncheckedUpdateWithoutWeddingInput>
  }

  export type BudgetItemUpdateManyWithWhereWithoutWeddingInput = {
    where: BudgetItemScalarWhereInput
    data: XOR<BudgetItemUpdateManyMutationInput, BudgetItemUncheckedUpdateManyWithoutWeddingInput>
  }

  export type BudgetItemScalarWhereInput = {
    AND?: BudgetItemScalarWhereInput | BudgetItemScalarWhereInput[]
    OR?: BudgetItemScalarWhereInput[]
    NOT?: BudgetItemScalarWhereInput | BudgetItemScalarWhereInput[]
    id?: StringFilter<"BudgetItem"> | string
    weddingId?: StringFilter<"BudgetItem"> | string
    category?: StringFilter<"BudgetItem"> | string
    title?: StringFilter<"BudgetItem"> | string
    estimated?: IntFilter<"BudgetItem"> | number
    actual?: IntFilter<"BudgetItem"> | number
    paid?: BoolFilter<"BudgetItem"> | boolean
    notes?: StringNullableFilter<"BudgetItem"> | string | null
    externalVendorId?: StringNullableFilter<"BudgetItem"> | string | null
    createdAt?: DateTimeFilter<"BudgetItem"> | Date | string
  }

  export type WeddingWebsiteUpsertWithoutWeddingInput = {
    update: XOR<WeddingWebsiteUpdateWithoutWeddingInput, WeddingWebsiteUncheckedUpdateWithoutWeddingInput>
    create: XOR<WeddingWebsiteCreateWithoutWeddingInput, WeddingWebsiteUncheckedCreateWithoutWeddingInput>
    where?: WeddingWebsiteWhereInput
  }

  export type WeddingWebsiteUpdateToOneWithWhereWithoutWeddingInput = {
    where?: WeddingWebsiteWhereInput
    data: XOR<WeddingWebsiteUpdateWithoutWeddingInput, WeddingWebsiteUncheckedUpdateWithoutWeddingInput>
  }

  export type WeddingWebsiteUpdateWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingWebsiteUncheckedUpdateWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingInvitationUpsertWithoutWeddingInput = {
    update: XOR<WeddingInvitationUpdateWithoutWeddingInput, WeddingInvitationUncheckedUpdateWithoutWeddingInput>
    create: XOR<WeddingInvitationCreateWithoutWeddingInput, WeddingInvitationUncheckedCreateWithoutWeddingInput>
    where?: WeddingInvitationWhereInput
  }

  export type WeddingInvitationUpdateToOneWithWhereWithoutWeddingInput = {
    where?: WeddingInvitationWhereInput
    data: XOR<WeddingInvitationUpdateWithoutWeddingInput, WeddingInvitationUncheckedUpdateWithoutWeddingInput>
  }

  export type WeddingInvitationUpdateWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingInvitationUncheckedUpdateWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingCreateWithoutWebsiteInput = {
    id?: string
    date: Date | string
    city: string
    guests: number
    budget: number
    partnerOneName?: string
    partnerTwoName?: string
    couplePhotoUrl?: string | null
    planningStage?: string
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutWeddingInput
    members?: WeddingMemberCreateNestedManyWithoutWeddingInput
    invites?: WeddingInviteCreateNestedManyWithoutWeddingInput
    tasks?: TaskCreateNestedManyWithoutWeddingInput
    guestList?: GuestCreateNestedManyWithoutWeddingInput
    budgetItems?: BudgetItemCreateNestedManyWithoutWeddingInput
    invitation?: WeddingInvitationCreateNestedOneWithoutWeddingInput
  }

  export type WeddingUncheckedCreateWithoutWebsiteInput = {
    id?: string
    userId: string
    date: Date | string
    city: string
    guests: number
    budget: number
    partnerOneName?: string
    partnerTwoName?: string
    couplePhotoUrl?: string | null
    planningStage?: string
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    members?: WeddingMemberUncheckedCreateNestedManyWithoutWeddingInput
    invites?: WeddingInviteUncheckedCreateNestedManyWithoutWeddingInput
    tasks?: TaskUncheckedCreateNestedManyWithoutWeddingInput
    guestList?: GuestUncheckedCreateNestedManyWithoutWeddingInput
    budgetItems?: BudgetItemUncheckedCreateNestedManyWithoutWeddingInput
    invitation?: WeddingInvitationUncheckedCreateNestedOneWithoutWeddingInput
  }

  export type WeddingCreateOrConnectWithoutWebsiteInput = {
    where: WeddingWhereUniqueInput
    create: XOR<WeddingCreateWithoutWebsiteInput, WeddingUncheckedCreateWithoutWebsiteInput>
  }

  export type WeddingUpsertWithoutWebsiteInput = {
    update: XOR<WeddingUpdateWithoutWebsiteInput, WeddingUncheckedUpdateWithoutWebsiteInput>
    create: XOR<WeddingCreateWithoutWebsiteInput, WeddingUncheckedCreateWithoutWebsiteInput>
    where?: WeddingWhereInput
  }

  export type WeddingUpdateToOneWithWhereWithoutWebsiteInput = {
    where?: WeddingWhereInput
    data: XOR<WeddingUpdateWithoutWebsiteInput, WeddingUncheckedUpdateWithoutWebsiteInput>
  }

  export type WeddingUpdateWithoutWebsiteInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    guests?: IntFieldUpdateOperationsInput | number
    budget?: IntFieldUpdateOperationsInput | number
    partnerOneName?: StringFieldUpdateOperationsInput | string
    partnerTwoName?: StringFieldUpdateOperationsInput | string
    couplePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    planningStage?: StringFieldUpdateOperationsInput | string
    cityUndecided?: BoolFieldUpdateOperationsInput | boolean
    guestsUndecided?: BoolFieldUpdateOperationsInput | boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutWeddingNestedInput
    members?: WeddingMemberUpdateManyWithoutWeddingNestedInput
    invites?: WeddingInviteUpdateManyWithoutWeddingNestedInput
    tasks?: TaskUpdateManyWithoutWeddingNestedInput
    guestList?: GuestUpdateManyWithoutWeddingNestedInput
    budgetItems?: BudgetItemUpdateManyWithoutWeddingNestedInput
    invitation?: WeddingInvitationUpdateOneWithoutWeddingNestedInput
  }

  export type WeddingUncheckedUpdateWithoutWebsiteInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    guests?: IntFieldUpdateOperationsInput | number
    budget?: IntFieldUpdateOperationsInput | number
    partnerOneName?: StringFieldUpdateOperationsInput | string
    partnerTwoName?: StringFieldUpdateOperationsInput | string
    couplePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    planningStage?: StringFieldUpdateOperationsInput | string
    cityUndecided?: BoolFieldUpdateOperationsInput | boolean
    guestsUndecided?: BoolFieldUpdateOperationsInput | boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    members?: WeddingMemberUncheckedUpdateManyWithoutWeddingNestedInput
    invites?: WeddingInviteUncheckedUpdateManyWithoutWeddingNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutWeddingNestedInput
    guestList?: GuestUncheckedUpdateManyWithoutWeddingNestedInput
    budgetItems?: BudgetItemUncheckedUpdateManyWithoutWeddingNestedInput
    invitation?: WeddingInvitationUncheckedUpdateOneWithoutWeddingNestedInput
  }

  export type WeddingCreateWithoutInvitationInput = {
    id?: string
    date: Date | string
    city: string
    guests: number
    budget: number
    partnerOneName?: string
    partnerTwoName?: string
    couplePhotoUrl?: string | null
    planningStage?: string
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutWeddingInput
    members?: WeddingMemberCreateNestedManyWithoutWeddingInput
    invites?: WeddingInviteCreateNestedManyWithoutWeddingInput
    tasks?: TaskCreateNestedManyWithoutWeddingInput
    guestList?: GuestCreateNestedManyWithoutWeddingInput
    budgetItems?: BudgetItemCreateNestedManyWithoutWeddingInput
    website?: WeddingWebsiteCreateNestedOneWithoutWeddingInput
  }

  export type WeddingUncheckedCreateWithoutInvitationInput = {
    id?: string
    userId: string
    date: Date | string
    city: string
    guests: number
    budget: number
    partnerOneName?: string
    partnerTwoName?: string
    couplePhotoUrl?: string | null
    planningStage?: string
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    members?: WeddingMemberUncheckedCreateNestedManyWithoutWeddingInput
    invites?: WeddingInviteUncheckedCreateNestedManyWithoutWeddingInput
    tasks?: TaskUncheckedCreateNestedManyWithoutWeddingInput
    guestList?: GuestUncheckedCreateNestedManyWithoutWeddingInput
    budgetItems?: BudgetItemUncheckedCreateNestedManyWithoutWeddingInput
    website?: WeddingWebsiteUncheckedCreateNestedOneWithoutWeddingInput
  }

  export type WeddingCreateOrConnectWithoutInvitationInput = {
    where: WeddingWhereUniqueInput
    create: XOR<WeddingCreateWithoutInvitationInput, WeddingUncheckedCreateWithoutInvitationInput>
  }

  export type WeddingUpsertWithoutInvitationInput = {
    update: XOR<WeddingUpdateWithoutInvitationInput, WeddingUncheckedUpdateWithoutInvitationInput>
    create: XOR<WeddingCreateWithoutInvitationInput, WeddingUncheckedCreateWithoutInvitationInput>
    where?: WeddingWhereInput
  }

  export type WeddingUpdateToOneWithWhereWithoutInvitationInput = {
    where?: WeddingWhereInput
    data: XOR<WeddingUpdateWithoutInvitationInput, WeddingUncheckedUpdateWithoutInvitationInput>
  }

  export type WeddingUpdateWithoutInvitationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    guests?: IntFieldUpdateOperationsInput | number
    budget?: IntFieldUpdateOperationsInput | number
    partnerOneName?: StringFieldUpdateOperationsInput | string
    partnerTwoName?: StringFieldUpdateOperationsInput | string
    couplePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    planningStage?: StringFieldUpdateOperationsInput | string
    cityUndecided?: BoolFieldUpdateOperationsInput | boolean
    guestsUndecided?: BoolFieldUpdateOperationsInput | boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutWeddingNestedInput
    members?: WeddingMemberUpdateManyWithoutWeddingNestedInput
    invites?: WeddingInviteUpdateManyWithoutWeddingNestedInput
    tasks?: TaskUpdateManyWithoutWeddingNestedInput
    guestList?: GuestUpdateManyWithoutWeddingNestedInput
    budgetItems?: BudgetItemUpdateManyWithoutWeddingNestedInput
    website?: WeddingWebsiteUpdateOneWithoutWeddingNestedInput
  }

  export type WeddingUncheckedUpdateWithoutInvitationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    guests?: IntFieldUpdateOperationsInput | number
    budget?: IntFieldUpdateOperationsInput | number
    partnerOneName?: StringFieldUpdateOperationsInput | string
    partnerTwoName?: StringFieldUpdateOperationsInput | string
    couplePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    planningStage?: StringFieldUpdateOperationsInput | string
    cityUndecided?: BoolFieldUpdateOperationsInput | boolean
    guestsUndecided?: BoolFieldUpdateOperationsInput | boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    members?: WeddingMemberUncheckedUpdateManyWithoutWeddingNestedInput
    invites?: WeddingInviteUncheckedUpdateManyWithoutWeddingNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutWeddingNestedInput
    guestList?: GuestUncheckedUpdateManyWithoutWeddingNestedInput
    budgetItems?: BudgetItemUncheckedUpdateManyWithoutWeddingNestedInput
    website?: WeddingWebsiteUncheckedUpdateOneWithoutWeddingNestedInput
  }

  export type WeddingCreateWithoutMembersInput = {
    id?: string
    date: Date | string
    city: string
    guests: number
    budget: number
    partnerOneName?: string
    partnerTwoName?: string
    couplePhotoUrl?: string | null
    planningStage?: string
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutWeddingInput
    invites?: WeddingInviteCreateNestedManyWithoutWeddingInput
    tasks?: TaskCreateNestedManyWithoutWeddingInput
    guestList?: GuestCreateNestedManyWithoutWeddingInput
    budgetItems?: BudgetItemCreateNestedManyWithoutWeddingInput
    website?: WeddingWebsiteCreateNestedOneWithoutWeddingInput
    invitation?: WeddingInvitationCreateNestedOneWithoutWeddingInput
  }

  export type WeddingUncheckedCreateWithoutMembersInput = {
    id?: string
    userId: string
    date: Date | string
    city: string
    guests: number
    budget: number
    partnerOneName?: string
    partnerTwoName?: string
    couplePhotoUrl?: string | null
    planningStage?: string
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    invites?: WeddingInviteUncheckedCreateNestedManyWithoutWeddingInput
    tasks?: TaskUncheckedCreateNestedManyWithoutWeddingInput
    guestList?: GuestUncheckedCreateNestedManyWithoutWeddingInput
    budgetItems?: BudgetItemUncheckedCreateNestedManyWithoutWeddingInput
    website?: WeddingWebsiteUncheckedCreateNestedOneWithoutWeddingInput
    invitation?: WeddingInvitationUncheckedCreateNestedOneWithoutWeddingInput
  }

  export type WeddingCreateOrConnectWithoutMembersInput = {
    where: WeddingWhereUniqueInput
    create: XOR<WeddingCreateWithoutMembersInput, WeddingUncheckedCreateWithoutMembersInput>
  }

  export type UserCreateWithoutWeddingMemberInput = {
    id?: string
    email: string
    password: string
    name: string
    role?: $Enums.Role
    blocked?: boolean
    refreshTokenHash?: string | null
    createdAt?: Date | string
    wedding?: WeddingCreateNestedOneWithoutUserInput
    externalVendors?: ExternalVendorCreateNestedManyWithoutUserInput
    contentPosts?: ContentPostCreateNestedManyWithoutAuthorInput
    pushDevices?: PushDeviceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutWeddingMemberInput = {
    id?: string
    email: string
    password: string
    name: string
    role?: $Enums.Role
    blocked?: boolean
    refreshTokenHash?: string | null
    createdAt?: Date | string
    wedding?: WeddingUncheckedCreateNestedOneWithoutUserInput
    externalVendors?: ExternalVendorUncheckedCreateNestedManyWithoutUserInput
    contentPosts?: ContentPostUncheckedCreateNestedManyWithoutAuthorInput
    pushDevices?: PushDeviceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutWeddingMemberInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWeddingMemberInput, UserUncheckedCreateWithoutWeddingMemberInput>
  }

  export type WeddingUpsertWithoutMembersInput = {
    update: XOR<WeddingUpdateWithoutMembersInput, WeddingUncheckedUpdateWithoutMembersInput>
    create: XOR<WeddingCreateWithoutMembersInput, WeddingUncheckedCreateWithoutMembersInput>
    where?: WeddingWhereInput
  }

  export type WeddingUpdateToOneWithWhereWithoutMembersInput = {
    where?: WeddingWhereInput
    data: XOR<WeddingUpdateWithoutMembersInput, WeddingUncheckedUpdateWithoutMembersInput>
  }

  export type WeddingUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    guests?: IntFieldUpdateOperationsInput | number
    budget?: IntFieldUpdateOperationsInput | number
    partnerOneName?: StringFieldUpdateOperationsInput | string
    partnerTwoName?: StringFieldUpdateOperationsInput | string
    couplePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    planningStage?: StringFieldUpdateOperationsInput | string
    cityUndecided?: BoolFieldUpdateOperationsInput | boolean
    guestsUndecided?: BoolFieldUpdateOperationsInput | boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutWeddingNestedInput
    invites?: WeddingInviteUpdateManyWithoutWeddingNestedInput
    tasks?: TaskUpdateManyWithoutWeddingNestedInput
    guestList?: GuestUpdateManyWithoutWeddingNestedInput
    budgetItems?: BudgetItemUpdateManyWithoutWeddingNestedInput
    website?: WeddingWebsiteUpdateOneWithoutWeddingNestedInput
    invitation?: WeddingInvitationUpdateOneWithoutWeddingNestedInput
  }

  export type WeddingUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    guests?: IntFieldUpdateOperationsInput | number
    budget?: IntFieldUpdateOperationsInput | number
    partnerOneName?: StringFieldUpdateOperationsInput | string
    partnerTwoName?: StringFieldUpdateOperationsInput | string
    couplePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    planningStage?: StringFieldUpdateOperationsInput | string
    cityUndecided?: BoolFieldUpdateOperationsInput | boolean
    guestsUndecided?: BoolFieldUpdateOperationsInput | boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    invites?: WeddingInviteUncheckedUpdateManyWithoutWeddingNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutWeddingNestedInput
    guestList?: GuestUncheckedUpdateManyWithoutWeddingNestedInput
    budgetItems?: BudgetItemUncheckedUpdateManyWithoutWeddingNestedInput
    website?: WeddingWebsiteUncheckedUpdateOneWithoutWeddingNestedInput
    invitation?: WeddingInvitationUncheckedUpdateOneWithoutWeddingNestedInput
  }

  export type UserUpsertWithoutWeddingMemberInput = {
    update: XOR<UserUpdateWithoutWeddingMemberInput, UserUncheckedUpdateWithoutWeddingMemberInput>
    create: XOR<UserCreateWithoutWeddingMemberInput, UserUncheckedCreateWithoutWeddingMemberInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWeddingMemberInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWeddingMemberInput, UserUncheckedUpdateWithoutWeddingMemberInput>
  }

  export type UserUpdateWithoutWeddingMemberInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    blocked?: BoolFieldUpdateOperationsInput | boolean
    refreshTokenHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wedding?: WeddingUpdateOneWithoutUserNestedInput
    externalVendors?: ExternalVendorUpdateManyWithoutUserNestedInput
    contentPosts?: ContentPostUpdateManyWithoutAuthorNestedInput
    pushDevices?: PushDeviceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutWeddingMemberInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    blocked?: BoolFieldUpdateOperationsInput | boolean
    refreshTokenHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wedding?: WeddingUncheckedUpdateOneWithoutUserNestedInput
    externalVendors?: ExternalVendorUncheckedUpdateManyWithoutUserNestedInput
    contentPosts?: ContentPostUncheckedUpdateManyWithoutAuthorNestedInput
    pushDevices?: PushDeviceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type WeddingCreateWithoutInvitesInput = {
    id?: string
    date: Date | string
    city: string
    guests: number
    budget: number
    partnerOneName?: string
    partnerTwoName?: string
    couplePhotoUrl?: string | null
    planningStage?: string
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutWeddingInput
    members?: WeddingMemberCreateNestedManyWithoutWeddingInput
    tasks?: TaskCreateNestedManyWithoutWeddingInput
    guestList?: GuestCreateNestedManyWithoutWeddingInput
    budgetItems?: BudgetItemCreateNestedManyWithoutWeddingInput
    website?: WeddingWebsiteCreateNestedOneWithoutWeddingInput
    invitation?: WeddingInvitationCreateNestedOneWithoutWeddingInput
  }

  export type WeddingUncheckedCreateWithoutInvitesInput = {
    id?: string
    userId: string
    date: Date | string
    city: string
    guests: number
    budget: number
    partnerOneName?: string
    partnerTwoName?: string
    couplePhotoUrl?: string | null
    planningStage?: string
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    members?: WeddingMemberUncheckedCreateNestedManyWithoutWeddingInput
    tasks?: TaskUncheckedCreateNestedManyWithoutWeddingInput
    guestList?: GuestUncheckedCreateNestedManyWithoutWeddingInput
    budgetItems?: BudgetItemUncheckedCreateNestedManyWithoutWeddingInput
    website?: WeddingWebsiteUncheckedCreateNestedOneWithoutWeddingInput
    invitation?: WeddingInvitationUncheckedCreateNestedOneWithoutWeddingInput
  }

  export type WeddingCreateOrConnectWithoutInvitesInput = {
    where: WeddingWhereUniqueInput
    create: XOR<WeddingCreateWithoutInvitesInput, WeddingUncheckedCreateWithoutInvitesInput>
  }

  export type WeddingUpsertWithoutInvitesInput = {
    update: XOR<WeddingUpdateWithoutInvitesInput, WeddingUncheckedUpdateWithoutInvitesInput>
    create: XOR<WeddingCreateWithoutInvitesInput, WeddingUncheckedCreateWithoutInvitesInput>
    where?: WeddingWhereInput
  }

  export type WeddingUpdateToOneWithWhereWithoutInvitesInput = {
    where?: WeddingWhereInput
    data: XOR<WeddingUpdateWithoutInvitesInput, WeddingUncheckedUpdateWithoutInvitesInput>
  }

  export type WeddingUpdateWithoutInvitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    guests?: IntFieldUpdateOperationsInput | number
    budget?: IntFieldUpdateOperationsInput | number
    partnerOneName?: StringFieldUpdateOperationsInput | string
    partnerTwoName?: StringFieldUpdateOperationsInput | string
    couplePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    planningStage?: StringFieldUpdateOperationsInput | string
    cityUndecided?: BoolFieldUpdateOperationsInput | boolean
    guestsUndecided?: BoolFieldUpdateOperationsInput | boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutWeddingNestedInput
    members?: WeddingMemberUpdateManyWithoutWeddingNestedInput
    tasks?: TaskUpdateManyWithoutWeddingNestedInput
    guestList?: GuestUpdateManyWithoutWeddingNestedInput
    budgetItems?: BudgetItemUpdateManyWithoutWeddingNestedInput
    website?: WeddingWebsiteUpdateOneWithoutWeddingNestedInput
    invitation?: WeddingInvitationUpdateOneWithoutWeddingNestedInput
  }

  export type WeddingUncheckedUpdateWithoutInvitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    guests?: IntFieldUpdateOperationsInput | number
    budget?: IntFieldUpdateOperationsInput | number
    partnerOneName?: StringFieldUpdateOperationsInput | string
    partnerTwoName?: StringFieldUpdateOperationsInput | string
    couplePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    planningStage?: StringFieldUpdateOperationsInput | string
    cityUndecided?: BoolFieldUpdateOperationsInput | boolean
    guestsUndecided?: BoolFieldUpdateOperationsInput | boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    members?: WeddingMemberUncheckedUpdateManyWithoutWeddingNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutWeddingNestedInput
    guestList?: GuestUncheckedUpdateManyWithoutWeddingNestedInput
    budgetItems?: BudgetItemUncheckedUpdateManyWithoutWeddingNestedInput
    website?: WeddingWebsiteUncheckedUpdateOneWithoutWeddingNestedInput
    invitation?: WeddingInvitationUncheckedUpdateOneWithoutWeddingNestedInput
  }

  export type WeddingCreateWithoutTasksInput = {
    id?: string
    date: Date | string
    city: string
    guests: number
    budget: number
    partnerOneName?: string
    partnerTwoName?: string
    couplePhotoUrl?: string | null
    planningStage?: string
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutWeddingInput
    members?: WeddingMemberCreateNestedManyWithoutWeddingInput
    invites?: WeddingInviteCreateNestedManyWithoutWeddingInput
    guestList?: GuestCreateNestedManyWithoutWeddingInput
    budgetItems?: BudgetItemCreateNestedManyWithoutWeddingInput
    website?: WeddingWebsiteCreateNestedOneWithoutWeddingInput
    invitation?: WeddingInvitationCreateNestedOneWithoutWeddingInput
  }

  export type WeddingUncheckedCreateWithoutTasksInput = {
    id?: string
    userId: string
    date: Date | string
    city: string
    guests: number
    budget: number
    partnerOneName?: string
    partnerTwoName?: string
    couplePhotoUrl?: string | null
    planningStage?: string
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    members?: WeddingMemberUncheckedCreateNestedManyWithoutWeddingInput
    invites?: WeddingInviteUncheckedCreateNestedManyWithoutWeddingInput
    guestList?: GuestUncheckedCreateNestedManyWithoutWeddingInput
    budgetItems?: BudgetItemUncheckedCreateNestedManyWithoutWeddingInput
    website?: WeddingWebsiteUncheckedCreateNestedOneWithoutWeddingInput
    invitation?: WeddingInvitationUncheckedCreateNestedOneWithoutWeddingInput
  }

  export type WeddingCreateOrConnectWithoutTasksInput = {
    where: WeddingWhereUniqueInput
    create: XOR<WeddingCreateWithoutTasksInput, WeddingUncheckedCreateWithoutTasksInput>
  }

  export type WeddingUpsertWithoutTasksInput = {
    update: XOR<WeddingUpdateWithoutTasksInput, WeddingUncheckedUpdateWithoutTasksInput>
    create: XOR<WeddingCreateWithoutTasksInput, WeddingUncheckedCreateWithoutTasksInput>
    where?: WeddingWhereInput
  }

  export type WeddingUpdateToOneWithWhereWithoutTasksInput = {
    where?: WeddingWhereInput
    data: XOR<WeddingUpdateWithoutTasksInput, WeddingUncheckedUpdateWithoutTasksInput>
  }

  export type WeddingUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    guests?: IntFieldUpdateOperationsInput | number
    budget?: IntFieldUpdateOperationsInput | number
    partnerOneName?: StringFieldUpdateOperationsInput | string
    partnerTwoName?: StringFieldUpdateOperationsInput | string
    couplePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    planningStage?: StringFieldUpdateOperationsInput | string
    cityUndecided?: BoolFieldUpdateOperationsInput | boolean
    guestsUndecided?: BoolFieldUpdateOperationsInput | boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutWeddingNestedInput
    members?: WeddingMemberUpdateManyWithoutWeddingNestedInput
    invites?: WeddingInviteUpdateManyWithoutWeddingNestedInput
    guestList?: GuestUpdateManyWithoutWeddingNestedInput
    budgetItems?: BudgetItemUpdateManyWithoutWeddingNestedInput
    website?: WeddingWebsiteUpdateOneWithoutWeddingNestedInput
    invitation?: WeddingInvitationUpdateOneWithoutWeddingNestedInput
  }

  export type WeddingUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    guests?: IntFieldUpdateOperationsInput | number
    budget?: IntFieldUpdateOperationsInput | number
    partnerOneName?: StringFieldUpdateOperationsInput | string
    partnerTwoName?: StringFieldUpdateOperationsInput | string
    couplePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    planningStage?: StringFieldUpdateOperationsInput | string
    cityUndecided?: BoolFieldUpdateOperationsInput | boolean
    guestsUndecided?: BoolFieldUpdateOperationsInput | boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    members?: WeddingMemberUncheckedUpdateManyWithoutWeddingNestedInput
    invites?: WeddingInviteUncheckedUpdateManyWithoutWeddingNestedInput
    guestList?: GuestUncheckedUpdateManyWithoutWeddingNestedInput
    budgetItems?: BudgetItemUncheckedUpdateManyWithoutWeddingNestedInput
    website?: WeddingWebsiteUncheckedUpdateOneWithoutWeddingNestedInput
    invitation?: WeddingInvitationUncheckedUpdateOneWithoutWeddingNestedInput
  }

  export type WeddingCreateWithoutGuestListInput = {
    id?: string
    date: Date | string
    city: string
    guests: number
    budget: number
    partnerOneName?: string
    partnerTwoName?: string
    couplePhotoUrl?: string | null
    planningStage?: string
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutWeddingInput
    members?: WeddingMemberCreateNestedManyWithoutWeddingInput
    invites?: WeddingInviteCreateNestedManyWithoutWeddingInput
    tasks?: TaskCreateNestedManyWithoutWeddingInput
    budgetItems?: BudgetItemCreateNestedManyWithoutWeddingInput
    website?: WeddingWebsiteCreateNestedOneWithoutWeddingInput
    invitation?: WeddingInvitationCreateNestedOneWithoutWeddingInput
  }

  export type WeddingUncheckedCreateWithoutGuestListInput = {
    id?: string
    userId: string
    date: Date | string
    city: string
    guests: number
    budget: number
    partnerOneName?: string
    partnerTwoName?: string
    couplePhotoUrl?: string | null
    planningStage?: string
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    members?: WeddingMemberUncheckedCreateNestedManyWithoutWeddingInput
    invites?: WeddingInviteUncheckedCreateNestedManyWithoutWeddingInput
    tasks?: TaskUncheckedCreateNestedManyWithoutWeddingInput
    budgetItems?: BudgetItemUncheckedCreateNestedManyWithoutWeddingInput
    website?: WeddingWebsiteUncheckedCreateNestedOneWithoutWeddingInput
    invitation?: WeddingInvitationUncheckedCreateNestedOneWithoutWeddingInput
  }

  export type WeddingCreateOrConnectWithoutGuestListInput = {
    where: WeddingWhereUniqueInput
    create: XOR<WeddingCreateWithoutGuestListInput, WeddingUncheckedCreateWithoutGuestListInput>
  }

  export type WeddingUpsertWithoutGuestListInput = {
    update: XOR<WeddingUpdateWithoutGuestListInput, WeddingUncheckedUpdateWithoutGuestListInput>
    create: XOR<WeddingCreateWithoutGuestListInput, WeddingUncheckedCreateWithoutGuestListInput>
    where?: WeddingWhereInput
  }

  export type WeddingUpdateToOneWithWhereWithoutGuestListInput = {
    where?: WeddingWhereInput
    data: XOR<WeddingUpdateWithoutGuestListInput, WeddingUncheckedUpdateWithoutGuestListInput>
  }

  export type WeddingUpdateWithoutGuestListInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    guests?: IntFieldUpdateOperationsInput | number
    budget?: IntFieldUpdateOperationsInput | number
    partnerOneName?: StringFieldUpdateOperationsInput | string
    partnerTwoName?: StringFieldUpdateOperationsInput | string
    couplePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    planningStage?: StringFieldUpdateOperationsInput | string
    cityUndecided?: BoolFieldUpdateOperationsInput | boolean
    guestsUndecided?: BoolFieldUpdateOperationsInput | boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutWeddingNestedInput
    members?: WeddingMemberUpdateManyWithoutWeddingNestedInput
    invites?: WeddingInviteUpdateManyWithoutWeddingNestedInput
    tasks?: TaskUpdateManyWithoutWeddingNestedInput
    budgetItems?: BudgetItemUpdateManyWithoutWeddingNestedInput
    website?: WeddingWebsiteUpdateOneWithoutWeddingNestedInput
    invitation?: WeddingInvitationUpdateOneWithoutWeddingNestedInput
  }

  export type WeddingUncheckedUpdateWithoutGuestListInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    guests?: IntFieldUpdateOperationsInput | number
    budget?: IntFieldUpdateOperationsInput | number
    partnerOneName?: StringFieldUpdateOperationsInput | string
    partnerTwoName?: StringFieldUpdateOperationsInput | string
    couplePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    planningStage?: StringFieldUpdateOperationsInput | string
    cityUndecided?: BoolFieldUpdateOperationsInput | boolean
    guestsUndecided?: BoolFieldUpdateOperationsInput | boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    members?: WeddingMemberUncheckedUpdateManyWithoutWeddingNestedInput
    invites?: WeddingInviteUncheckedUpdateManyWithoutWeddingNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutWeddingNestedInput
    budgetItems?: BudgetItemUncheckedUpdateManyWithoutWeddingNestedInput
    website?: WeddingWebsiteUncheckedUpdateOneWithoutWeddingNestedInput
    invitation?: WeddingInvitationUncheckedUpdateOneWithoutWeddingNestedInput
  }

  export type WeddingCreateWithoutBudgetItemsInput = {
    id?: string
    date: Date | string
    city: string
    guests: number
    budget: number
    partnerOneName?: string
    partnerTwoName?: string
    couplePhotoUrl?: string | null
    planningStage?: string
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutWeddingInput
    members?: WeddingMemberCreateNestedManyWithoutWeddingInput
    invites?: WeddingInviteCreateNestedManyWithoutWeddingInput
    tasks?: TaskCreateNestedManyWithoutWeddingInput
    guestList?: GuestCreateNestedManyWithoutWeddingInput
    website?: WeddingWebsiteCreateNestedOneWithoutWeddingInput
    invitation?: WeddingInvitationCreateNestedOneWithoutWeddingInput
  }

  export type WeddingUncheckedCreateWithoutBudgetItemsInput = {
    id?: string
    userId: string
    date: Date | string
    city: string
    guests: number
    budget: number
    partnerOneName?: string
    partnerTwoName?: string
    couplePhotoUrl?: string | null
    planningStage?: string
    cityUndecided?: boolean
    guestsUndecided?: boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    members?: WeddingMemberUncheckedCreateNestedManyWithoutWeddingInput
    invites?: WeddingInviteUncheckedCreateNestedManyWithoutWeddingInput
    tasks?: TaskUncheckedCreateNestedManyWithoutWeddingInput
    guestList?: GuestUncheckedCreateNestedManyWithoutWeddingInput
    website?: WeddingWebsiteUncheckedCreateNestedOneWithoutWeddingInput
    invitation?: WeddingInvitationUncheckedCreateNestedOneWithoutWeddingInput
  }

  export type WeddingCreateOrConnectWithoutBudgetItemsInput = {
    where: WeddingWhereUniqueInput
    create: XOR<WeddingCreateWithoutBudgetItemsInput, WeddingUncheckedCreateWithoutBudgetItemsInput>
  }

  export type ExternalVendorCreateWithoutBudgetItemInput = {
    id?: string
    name: string
    category: string
    city: string
    phone?: string | null
    website?: string | null
    quotedPrice?: number | null
    notes?: string | null
    stage?: $Enums.VendorPipelineStage
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutExternalVendorsInput
  }

  export type ExternalVendorUncheckedCreateWithoutBudgetItemInput = {
    id?: string
    userId: string
    name: string
    category: string
    city: string
    phone?: string | null
    website?: string | null
    quotedPrice?: number | null
    notes?: string | null
    stage?: $Enums.VendorPipelineStage
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExternalVendorCreateOrConnectWithoutBudgetItemInput = {
    where: ExternalVendorWhereUniqueInput
    create: XOR<ExternalVendorCreateWithoutBudgetItemInput, ExternalVendorUncheckedCreateWithoutBudgetItemInput>
  }

  export type WeddingUpsertWithoutBudgetItemsInput = {
    update: XOR<WeddingUpdateWithoutBudgetItemsInput, WeddingUncheckedUpdateWithoutBudgetItemsInput>
    create: XOR<WeddingCreateWithoutBudgetItemsInput, WeddingUncheckedCreateWithoutBudgetItemsInput>
    where?: WeddingWhereInput
  }

  export type WeddingUpdateToOneWithWhereWithoutBudgetItemsInput = {
    where?: WeddingWhereInput
    data: XOR<WeddingUpdateWithoutBudgetItemsInput, WeddingUncheckedUpdateWithoutBudgetItemsInput>
  }

  export type WeddingUpdateWithoutBudgetItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    guests?: IntFieldUpdateOperationsInput | number
    budget?: IntFieldUpdateOperationsInput | number
    partnerOneName?: StringFieldUpdateOperationsInput | string
    partnerTwoName?: StringFieldUpdateOperationsInput | string
    couplePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    planningStage?: StringFieldUpdateOperationsInput | string
    cityUndecided?: BoolFieldUpdateOperationsInput | boolean
    guestsUndecided?: BoolFieldUpdateOperationsInput | boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutWeddingNestedInput
    members?: WeddingMemberUpdateManyWithoutWeddingNestedInput
    invites?: WeddingInviteUpdateManyWithoutWeddingNestedInput
    tasks?: TaskUpdateManyWithoutWeddingNestedInput
    guestList?: GuestUpdateManyWithoutWeddingNestedInput
    website?: WeddingWebsiteUpdateOneWithoutWeddingNestedInput
    invitation?: WeddingInvitationUpdateOneWithoutWeddingNestedInput
  }

  export type WeddingUncheckedUpdateWithoutBudgetItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: StringFieldUpdateOperationsInput | string
    guests?: IntFieldUpdateOperationsInput | number
    budget?: IntFieldUpdateOperationsInput | number
    partnerOneName?: StringFieldUpdateOperationsInput | string
    partnerTwoName?: StringFieldUpdateOperationsInput | string
    couplePhotoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    planningStage?: StringFieldUpdateOperationsInput | string
    cityUndecided?: BoolFieldUpdateOperationsInput | boolean
    guestsUndecided?: BoolFieldUpdateOperationsInput | boolean
    dayPlan?: NullableJsonNullValueInput | InputJsonValue
    members?: WeddingMemberUncheckedUpdateManyWithoutWeddingNestedInput
    invites?: WeddingInviteUncheckedUpdateManyWithoutWeddingNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutWeddingNestedInput
    guestList?: GuestUncheckedUpdateManyWithoutWeddingNestedInput
    website?: WeddingWebsiteUncheckedUpdateOneWithoutWeddingNestedInput
    invitation?: WeddingInvitationUncheckedUpdateOneWithoutWeddingNestedInput
  }

  export type ExternalVendorUpsertWithoutBudgetItemInput = {
    update: XOR<ExternalVendorUpdateWithoutBudgetItemInput, ExternalVendorUncheckedUpdateWithoutBudgetItemInput>
    create: XOR<ExternalVendorCreateWithoutBudgetItemInput, ExternalVendorUncheckedCreateWithoutBudgetItemInput>
    where?: ExternalVendorWhereInput
  }

  export type ExternalVendorUpdateToOneWithWhereWithoutBudgetItemInput = {
    where?: ExternalVendorWhereInput
    data: XOR<ExternalVendorUpdateWithoutBudgetItemInput, ExternalVendorUncheckedUpdateWithoutBudgetItemInput>
  }

  export type ExternalVendorUpdateWithoutBudgetItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    quotedPrice?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    stage?: EnumVendorPipelineStageFieldUpdateOperationsInput | $Enums.VendorPipelineStage
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutExternalVendorsNestedInput
  }

  export type ExternalVendorUncheckedUpdateWithoutBudgetItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    quotedPrice?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    stage?: EnumVendorPipelineStageFieldUpdateOperationsInput | $Enums.VendorPipelineStage
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContentPostCreateWithoutTopicInput = {
    id?: string
    title: string
    slug: string
    excerpt?: string
    coverUrl?: string | null
    kind?: $Enums.ContentKind
    status?: $Enums.ContentStatus
    body?: JsonNullValueInput | InputJsonValue
    seoTitle?: string
    seoDescription?: string
    ogImageUrl?: string | null
    city?: string | null
    featured?: boolean
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    author?: UserCreateNestedOneWithoutContentPostsInput
  }

  export type ContentPostUncheckedCreateWithoutTopicInput = {
    id?: string
    title: string
    slug: string
    excerpt?: string
    coverUrl?: string | null
    kind?: $Enums.ContentKind
    status?: $Enums.ContentStatus
    body?: JsonNullValueInput | InputJsonValue
    seoTitle?: string
    seoDescription?: string
    ogImageUrl?: string | null
    city?: string | null
    featured?: boolean
    authorId?: string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContentPostCreateOrConnectWithoutTopicInput = {
    where: ContentPostWhereUniqueInput
    create: XOR<ContentPostCreateWithoutTopicInput, ContentPostUncheckedCreateWithoutTopicInput>
  }

  export type ContentPostCreateManyTopicInputEnvelope = {
    data: ContentPostCreateManyTopicInput | ContentPostCreateManyTopicInput[]
    skipDuplicates?: boolean
  }

  export type ContentPostUpsertWithWhereUniqueWithoutTopicInput = {
    where: ContentPostWhereUniqueInput
    update: XOR<ContentPostUpdateWithoutTopicInput, ContentPostUncheckedUpdateWithoutTopicInput>
    create: XOR<ContentPostCreateWithoutTopicInput, ContentPostUncheckedCreateWithoutTopicInput>
  }

  export type ContentPostUpdateWithWhereUniqueWithoutTopicInput = {
    where: ContentPostWhereUniqueInput
    data: XOR<ContentPostUpdateWithoutTopicInput, ContentPostUncheckedUpdateWithoutTopicInput>
  }

  export type ContentPostUpdateManyWithWhereWithoutTopicInput = {
    where: ContentPostScalarWhereInput
    data: XOR<ContentPostUpdateManyMutationInput, ContentPostUncheckedUpdateManyWithoutTopicInput>
  }

  export type ContentTopicCreateWithoutPostsInput = {
    id?: string
    name: string
    slug: string
    description?: string
    icon?: string
    coverUrl?: string | null
    sortOrder?: number
  }

  export type ContentTopicUncheckedCreateWithoutPostsInput = {
    id?: string
    name: string
    slug: string
    description?: string
    icon?: string
    coverUrl?: string | null
    sortOrder?: number
  }

  export type ContentTopicCreateOrConnectWithoutPostsInput = {
    where: ContentTopicWhereUniqueInput
    create: XOR<ContentTopicCreateWithoutPostsInput, ContentTopicUncheckedCreateWithoutPostsInput>
  }

  export type UserCreateWithoutContentPostsInput = {
    id?: string
    email: string
    password: string
    name: string
    role?: $Enums.Role
    blocked?: boolean
    refreshTokenHash?: string | null
    createdAt?: Date | string
    wedding?: WeddingCreateNestedOneWithoutUserInput
    weddingMember?: WeddingMemberCreateNestedOneWithoutUserInput
    externalVendors?: ExternalVendorCreateNestedManyWithoutUserInput
    pushDevices?: PushDeviceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutContentPostsInput = {
    id?: string
    email: string
    password: string
    name: string
    role?: $Enums.Role
    blocked?: boolean
    refreshTokenHash?: string | null
    createdAt?: Date | string
    wedding?: WeddingUncheckedCreateNestedOneWithoutUserInput
    weddingMember?: WeddingMemberUncheckedCreateNestedOneWithoutUserInput
    externalVendors?: ExternalVendorUncheckedCreateNestedManyWithoutUserInput
    pushDevices?: PushDeviceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutContentPostsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutContentPostsInput, UserUncheckedCreateWithoutContentPostsInput>
  }

  export type ContentTopicUpsertWithoutPostsInput = {
    update: XOR<ContentTopicUpdateWithoutPostsInput, ContentTopicUncheckedUpdateWithoutPostsInput>
    create: XOR<ContentTopicCreateWithoutPostsInput, ContentTopicUncheckedCreateWithoutPostsInput>
    where?: ContentTopicWhereInput
  }

  export type ContentTopicUpdateToOneWithWhereWithoutPostsInput = {
    where?: ContentTopicWhereInput
    data: XOR<ContentTopicUpdateWithoutPostsInput, ContentTopicUncheckedUpdateWithoutPostsInput>
  }

  export type ContentTopicUpdateWithoutPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type ContentTopicUncheckedUpdateWithoutPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type UserUpsertWithoutContentPostsInput = {
    update: XOR<UserUpdateWithoutContentPostsInput, UserUncheckedUpdateWithoutContentPostsInput>
    create: XOR<UserCreateWithoutContentPostsInput, UserUncheckedCreateWithoutContentPostsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutContentPostsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutContentPostsInput, UserUncheckedUpdateWithoutContentPostsInput>
  }

  export type UserUpdateWithoutContentPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    blocked?: BoolFieldUpdateOperationsInput | boolean
    refreshTokenHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wedding?: WeddingUpdateOneWithoutUserNestedInput
    weddingMember?: WeddingMemberUpdateOneWithoutUserNestedInput
    externalVendors?: ExternalVendorUpdateManyWithoutUserNestedInput
    pushDevices?: PushDeviceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutContentPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    blocked?: BoolFieldUpdateOperationsInput | boolean
    refreshTokenHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wedding?: WeddingUncheckedUpdateOneWithoutUserNestedInput
    weddingMember?: WeddingMemberUncheckedUpdateOneWithoutUserNestedInput
    externalVendors?: ExternalVendorUncheckedUpdateManyWithoutUserNestedInput
    pushDevices?: PushDeviceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ExternalVendorCreateManyUserInput = {
    id?: string
    name: string
    category: string
    city: string
    phone?: string | null
    website?: string | null
    quotedPrice?: number | null
    notes?: string | null
    stage?: $Enums.VendorPipelineStage
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContentPostCreateManyAuthorInput = {
    id?: string
    title: string
    slug: string
    excerpt?: string
    coverUrl?: string | null
    kind?: $Enums.ContentKind
    status?: $Enums.ContentStatus
    body?: JsonNullValueInput | InputJsonValue
    seoTitle?: string
    seoDescription?: string
    ogImageUrl?: string | null
    city?: string | null
    featured?: boolean
    topicId: string
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PushDeviceCreateManyUserInput = {
    id?: string
    token: string
    platform?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExternalVendorUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    quotedPrice?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    stage?: EnumVendorPipelineStageFieldUpdateOperationsInput | $Enums.VendorPipelineStage
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    budgetItem?: BudgetItemUpdateOneWithoutExternalVendorNestedInput
  }

  export type ExternalVendorUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    quotedPrice?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    stage?: EnumVendorPipelineStageFieldUpdateOperationsInput | $Enums.VendorPipelineStage
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    budgetItem?: BudgetItemUncheckedUpdateOneWithoutExternalVendorNestedInput
  }

  export type ExternalVendorUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    quotedPrice?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    stage?: EnumVendorPipelineStageFieldUpdateOperationsInput | $Enums.VendorPipelineStage
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContentPostUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    excerpt?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: EnumContentKindFieldUpdateOperationsInput | $Enums.ContentKind
    status?: EnumContentStatusFieldUpdateOperationsInput | $Enums.ContentStatus
    body?: JsonNullValueInput | InputJsonValue
    seoTitle?: StringFieldUpdateOperationsInput | string
    seoDescription?: StringFieldUpdateOperationsInput | string
    ogImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    featured?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    topic?: ContentTopicUpdateOneRequiredWithoutPostsNestedInput
  }

  export type ContentPostUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    excerpt?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: EnumContentKindFieldUpdateOperationsInput | $Enums.ContentKind
    status?: EnumContentStatusFieldUpdateOperationsInput | $Enums.ContentStatus
    body?: JsonNullValueInput | InputJsonValue
    seoTitle?: StringFieldUpdateOperationsInput | string
    seoDescription?: StringFieldUpdateOperationsInput | string
    ogImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    featured?: BoolFieldUpdateOperationsInput | boolean
    topicId?: StringFieldUpdateOperationsInput | string
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContentPostUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    excerpt?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: EnumContentKindFieldUpdateOperationsInput | $Enums.ContentKind
    status?: EnumContentStatusFieldUpdateOperationsInput | $Enums.ContentStatus
    body?: JsonNullValueInput | InputJsonValue
    seoTitle?: StringFieldUpdateOperationsInput | string
    seoDescription?: StringFieldUpdateOperationsInput | string
    ogImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    featured?: BoolFieldUpdateOperationsInput | boolean
    topicId?: StringFieldUpdateOperationsInput | string
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushDeviceUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushDeviceUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushDeviceUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingMemberCreateManyWeddingInput = {
    id?: string
    userId: string
    role?: $Enums.WeddingMemberRole
    createdAt?: Date | string
  }

  export type WeddingInviteCreateManyWeddingInput = {
    id?: string
    token?: string
    expiresAt: Date | string
    acceptedAt?: Date | string | null
    acceptedBy?: string | null
    createdAt?: Date | string
  }

  export type TaskCreateManyWeddingInput = {
    id?: string
    title: string
    categorySlug?: string | null
    status?: $Enums.TaskStatus
    dueDate?: Date | string | null
    dueRemindedAt?: Date | string | null
    sortOrder?: number
    isCustom?: boolean
    assignee?: string | null
  }

  export type GuestCreateManyWeddingInput = {
    id?: string
    name: string
    email?: string | null
    phone?: string | null
    side?: $Enums.GuestSide
    rsvpStatus?: $Enums.RsvpStatus
    plusOne?: boolean
    plusOneName?: string | null
    plusOneAttending?: boolean | null
    allergies?: string | null
    tableLabel?: string | null
    notes?: string | null
    inviteToken?: string
    respondedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type BudgetItemCreateManyWeddingInput = {
    id?: string
    category: string
    title: string
    estimated?: number
    actual?: number
    paid?: boolean
    notes?: string | null
    externalVendorId?: string | null
    createdAt?: Date | string
  }

  export type WeddingMemberUpdateWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumWeddingMemberRoleFieldUpdateOperationsInput | $Enums.WeddingMemberRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWeddingMemberNestedInput
  }

  export type WeddingMemberUncheckedUpdateWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: EnumWeddingMemberRoleFieldUpdateOperationsInput | $Enums.WeddingMemberRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingMemberUncheckedUpdateManyWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: EnumWeddingMemberRoleFieldUpdateOperationsInput | $Enums.WeddingMemberRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingInviteUpdateWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acceptedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acceptedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingInviteUncheckedUpdateWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acceptedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acceptedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeddingInviteUncheckedUpdateManyWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acceptedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acceptedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUpdateWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    categorySlug?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueRemindedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isCustom?: BoolFieldUpdateOperationsInput | boolean
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TaskUncheckedUpdateWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    categorySlug?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueRemindedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isCustom?: BoolFieldUpdateOperationsInput | boolean
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TaskUncheckedUpdateManyWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    categorySlug?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dueRemindedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isCustom?: BoolFieldUpdateOperationsInput | boolean
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GuestUpdateWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    side?: EnumGuestSideFieldUpdateOperationsInput | $Enums.GuestSide
    rsvpStatus?: EnumRsvpStatusFieldUpdateOperationsInput | $Enums.RsvpStatus
    plusOne?: BoolFieldUpdateOperationsInput | boolean
    plusOneName?: NullableStringFieldUpdateOperationsInput | string | null
    plusOneAttending?: NullableBoolFieldUpdateOperationsInput | boolean | null
    allergies?: NullableStringFieldUpdateOperationsInput | string | null
    tableLabel?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    inviteToken?: StringFieldUpdateOperationsInput | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestUncheckedUpdateWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    side?: EnumGuestSideFieldUpdateOperationsInput | $Enums.GuestSide
    rsvpStatus?: EnumRsvpStatusFieldUpdateOperationsInput | $Enums.RsvpStatus
    plusOne?: BoolFieldUpdateOperationsInput | boolean
    plusOneName?: NullableStringFieldUpdateOperationsInput | string | null
    plusOneAttending?: NullableBoolFieldUpdateOperationsInput | boolean | null
    allergies?: NullableStringFieldUpdateOperationsInput | string | null
    tableLabel?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    inviteToken?: StringFieldUpdateOperationsInput | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestUncheckedUpdateManyWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    side?: EnumGuestSideFieldUpdateOperationsInput | $Enums.GuestSide
    rsvpStatus?: EnumRsvpStatusFieldUpdateOperationsInput | $Enums.RsvpStatus
    plusOne?: BoolFieldUpdateOperationsInput | boolean
    plusOneName?: NullableStringFieldUpdateOperationsInput | string | null
    plusOneAttending?: NullableBoolFieldUpdateOperationsInput | boolean | null
    allergies?: NullableStringFieldUpdateOperationsInput | string | null
    tableLabel?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    inviteToken?: StringFieldUpdateOperationsInput | string
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BudgetItemUpdateWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    estimated?: IntFieldUpdateOperationsInput | number
    actual?: IntFieldUpdateOperationsInput | number
    paid?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    externalVendor?: ExternalVendorUpdateOneWithoutBudgetItemNestedInput
  }

  export type BudgetItemUncheckedUpdateWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    estimated?: IntFieldUpdateOperationsInput | number
    actual?: IntFieldUpdateOperationsInput | number
    paid?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    externalVendorId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BudgetItemUncheckedUpdateManyWithoutWeddingInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    estimated?: IntFieldUpdateOperationsInput | number
    actual?: IntFieldUpdateOperationsInput | number
    paid?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    externalVendorId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContentPostCreateManyTopicInput = {
    id?: string
    title: string
    slug: string
    excerpt?: string
    coverUrl?: string | null
    kind?: $Enums.ContentKind
    status?: $Enums.ContentStatus
    body?: JsonNullValueInput | InputJsonValue
    seoTitle?: string
    seoDescription?: string
    ogImageUrl?: string | null
    city?: string | null
    featured?: boolean
    authorId?: string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContentPostUpdateWithoutTopicInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    excerpt?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: EnumContentKindFieldUpdateOperationsInput | $Enums.ContentKind
    status?: EnumContentStatusFieldUpdateOperationsInput | $Enums.ContentStatus
    body?: JsonNullValueInput | InputJsonValue
    seoTitle?: StringFieldUpdateOperationsInput | string
    seoDescription?: StringFieldUpdateOperationsInput | string
    ogImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    featured?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserUpdateOneWithoutContentPostsNestedInput
  }

  export type ContentPostUncheckedUpdateWithoutTopicInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    excerpt?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: EnumContentKindFieldUpdateOperationsInput | $Enums.ContentKind
    status?: EnumContentStatusFieldUpdateOperationsInput | $Enums.ContentStatus
    body?: JsonNullValueInput | InputJsonValue
    seoTitle?: StringFieldUpdateOperationsInput | string
    seoDescription?: StringFieldUpdateOperationsInput | string
    ogImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    featured?: BoolFieldUpdateOperationsInput | boolean
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContentPostUncheckedUpdateManyWithoutTopicInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    excerpt?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: EnumContentKindFieldUpdateOperationsInput | $Enums.ContentKind
    status?: EnumContentStatusFieldUpdateOperationsInput | $Enums.ContentStatus
    body?: JsonNullValueInput | InputJsonValue
    seoTitle?: StringFieldUpdateOperationsInput | string
    seoDescription?: StringFieldUpdateOperationsInput | string
    ogImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    featured?: BoolFieldUpdateOperationsInput | boolean
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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