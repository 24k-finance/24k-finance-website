export const goldmineFactoryIdl = {
    version: "0.1.0",
    name: "launchpad",
    instructions: [
      {
        name: "applyMine",
        accounts: [
          {
            name: "application",
            isMut: true,
            isSigner: false,
          },
          {
            name: "owner",
            isMut: true,
            isSigner: true,
          },
          {
            name: "systemProgram",
            isMut: false,
            isSigner: false,
          },
        ],
        args: [
          {
            name: "params",
            type: {
              defined: "ApplyMineParams",
            },
          },
        ],
      },
      {
        name: "approveMine",
        accounts: [
          {
            name: "application",
            isMut: true,
            isSigner: false,
          },
          {
            name: "admin",
            isMut: false,
            isSigner: true,
          },
        ],
        args: [
          {
            name: "mineCode",
            type: "string",
          },
        ],
      },
      {
        name: "release",
        accounts: [
          {
            name: "pool",
            isMut: true,
            isSigner: false,
          },
          {
            name: "receiver",
            isMut: true,
            isSigner: false,
          },
          {
            name: "vault",
            isMut: true,
            isSigner: false,
          },
          {
            name: "authority",
            isMut: true,
            isSigner: true,
          },
          {
            name: "tokenProgram",
            isMut: false,
            isSigner: false,
          },
        ],
        args: [],
      },
      {
        name: "signMine",
        accounts: [
          {
            name: "application",
            isMut: true,
            isSigner: false,
          },
          {
            name: "owner",
            isMut: true,
            isSigner: true,
          },
          {
            name: "launchPool",
            isMut: true,
            isSigner: false,
          },
          {
            name: "paymentVault",
            isMut: true,
            isSigner: true,
          },
          {
            name: "paymentMint",
            isMut: false,
            isSigner: false,
          },
          {
            name: "tokenProgram",
            isMut: false,
            isSigner: false,
          },
          {
            name: "systemProgram",
            isMut: false,
            isSigner: false,
          },
          {
            name: "rent",
            isMut: false,
            isSigner: false,
          },
        ],
        args: [
          {
            name: "mineCode",
            type: "string",
          },
        ],
      },
      {
        name: "stake",
        accounts: [
          {
            name: "pool",
            isMut: true,
            isSigner: false,
          },
          {
            name: "vault",
            isMut: true,
            isSigner: false,
          },
          {
            name: "from",
            isMut: true,
            isSigner: false,
          },
          {
            name: "record",
            isMut: true,
            isSigner: false,
          },
          {
            name: "investor",
            isMut: true,
            isSigner: true,
          },
          {
            name: "tokenProgram",
            isMut: false,
            isSigner: false,
          },
          {
            name: "systemProgram",
            isMut: false,
            isSigner: false,
          },
        ],
        args: [
          {
            name: "params",
            type: {
              defined: "StakeParams",
            },
          },
        ],
      },
    ],
    accounts: [
      {
        name: "LaunchPool",
        type: {
          kind: "struct",
          fields: [
            {
              name: "mineCode",
              type: "string",
            },
            {
              name: "authority",
              type: "publicKey",
            },
            {
              name: "startDate",
              type: "i64",
            },
            {
              name: "endDate",
              type: "i64",
            },
            {
              name: "rate",
              type: "u32",
            },
            {
              name: "frozenMonth",
              type: "u8",
            },
            {
              name: "hardCap",
              type: "u128",
            },
            {
              name: "totalRaised",
              type: "u128",
            },
            {
              name: "currency",
              type: "string",
            },
          ],
        },
      },
      {
        name: "MineApplication",
        type: {
          kind: "struct",
          fields: [
            {
              name: "mineCode",
              type: "string",
            },
            {
              name: "name",
              type: "string",
            },
            {
              name: "operator",
              type: "string",
            },
            {
              name: "relationship",
              type: "string",
            },
            {
              name: "scale",
              type: "string",
            },
            {
              name: "location",
              type: "string",
            },
            {
              name: "approval1",
              type: "string",
            },
            {
              name: "approval2",
              type: "string",
            },
            {
              name: "approval3",
              type: "string",
            },
            {
              name: "financeScale",
              type: "u128",
            },
            {
              name: "currency",
              type: "string",
            },
            {
              name: "startDate",
              type: "i64",
            },
            {
              name: "endDate",
              type: "i64",
            },
            {
              name: "rate",
              type: "u32",
            },
            {
              name: "frozenMonth",
              type: "u8",
            },
            {
              name: "owner",
              type: "publicKey",
            },
            {
              name: "approved",
              type: "bool",
            },
            {
              name: "signed",
              type: "bool",
            },
          ],
        },
      },
      {
        name: "StakeRecord",
        type: {
          kind: "struct",
          fields: [
            {
              name: "investor",
              type: "publicKey",
            },
            {
              name: "pool",
              type: "publicKey",
            },
            {
              name: "amount",
              type: "u128",
            },
            {
              name: "timestamp",
              type: "i64",
            },
          ],
        },
      },
    ],
    types: [
      {
        name: "ApplyMineParams",
        type: {
          kind: "struct",
          fields: [
            {
              name: "mineCode",
              type: "string",
            },
            {
              name: "name",
              type: "string",
            },
            {
              name: "operator",
              type: "string",
            },
            {
              name: "relationship",
              type: "string",
            },
            {
              name: "scale",
              type: "string",
            },
            {
              name: "location",
              type: "string",
            },
            {
              name: "approval1",
              type: "string",
            },
            {
              name: "approval2",
              type: "string",
            },
            {
              name: "approval3",
              type: "string",
            },
            {
              name: "financeScale",
              type: "u128",
            },
            {
              name: "currency",
              type: "string",
            },
            {
              name: "startDate",
              type: "i64",
            },
            {
              name: "endDate",
              type: "i64",
            },
            {
              name: "rate",
              type: "u32",
            },
            {
              name: "frozenMonth",
              type: "u8",
            },
          ],
        },
      },
      {
        name: "StakeParams",
        type: {
          kind: "struct",
          fields: [
            {
              name: "amount",
              type: "u128",
            },
          ],
        },
      },
    ],
    errors: [
      {
        code: 6000,
        name: "StartTimeInPast",
        msg: "Start time must be in the future",
      },
      {
        code: 6001,
        name: "InvalidTimeRange",
        msg: "End time must be after start time",
      },
      {
        code: 6002,
        name: "InvalidFrozenPeriod",
        msg: "Frozen period must be 1-36 months",
      },
      {
        code: 6003,
        name: "InvalidRate",
        msg: "Invalid rate (0-10000 allowed)",
      },
      {
        code: 6004,
        name: "CapExceeded",
        msg: "Hard cap exceeded",
      },
      {
        code: 6005,
        name: "NotInFundingPeriod",
        msg: "Funding period has ended",
      },
      {
        code: 6006,
        name: "ReleaseNotYet",
        msg: "Release time not reached",
      },
      {
        code: 6007,
        name: "NoFundsToRelease",
        msg: "No funds to release",
      },
      {
        code: 6008,
        name: "InvalidCoinType",
        msg: "Invalid stable coin type (USDC/USDT only)",
      },
      {
        code: 6009,
        name: "InvalidLength",
        msg: "String length exceeds limit",
      },
      {
        code: 6010,
        name: "MineNotApproved",
        msg: "Mine not approved",
      },
      {
        code: 6011,
        name: "NotApproved",
        msg: "Not approved",
      },
      {
        code: 6012,
        name: "AlreadyApproved",
        msg: "Already approved",
      },
      {
        code: 6013,
        name: "AlreadySigned",
        msg: "Already signed",
      },
      {
        code: 6014,
        name: "Unauthorized",
        msg: "Unauthorized access",
      },
      {
        code: 6015,
        name: "ArithmeticOverflow",
        msg: "Arithmetic overflow occurred",
      },
    ],
  }