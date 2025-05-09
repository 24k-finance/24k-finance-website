# ✅ 金矿 Launchpad 项目完整业务流程（前端对接视角）

# programId
```ts
const programId = new PublicKey("CqcCvZmiLwhgKJvhVzttVct2aHRW4n1dJFNiSpoJQHuq");
```

---

## 🧭 主体角色：

| 角色 | 权限/行为 |
|------|------------|
| 🧑 用户 / 项目方 | 申请金矿 → 审核通过后签署合约 → 创建 LaunchPool |
| 👮 管理员 | 审核矿项目（approve） |
| 🧑 投资者 | 浏览池子 → stake USDC/USDT 投资 |
| 📦 程序账户 | 管理 vault，记录 pool 和 stake 状态 |

---

## 🧱 账户结构（简化）

| 名称 | 类型 | 描述 |
|------|------|------|
| `MineApplication` | PDA | 每个矿申请信息 |
| `LaunchPool` | PDA | 每个矿对应的资金池 |
| `Vault` | Token Account（属于程序） | 项目方的金库 |
| `StakeRecord` | PDA | 投资者的投资记录 |

---

# 🔄 前端完整流程

---

## ① 用户申请金矿（apply）

### 🧑 项目方操作：

```ts
await program.methods.applyMine(params).accounts({
  application: mineAppPDA,
  owner: wallet.publicKey,
  systemProgram: SystemProgram.programId
}).rpc();
```

### ✅ 前端 UI：

- 填表单（矿名、简介、时间、项目方地址）
- 点击【申请金矿】按钮
- 钱包弹出确认
- → 成功后记录 `MineApplication`（PDA）

---

## ② 管理员审核金矿（approve）

### 👮 管理员操作：

```ts
await program.methods.approveMine().accounts({
  admin: wallet.publicKey,
  application: mineAppPDA,
}).rpc();
```

### ✅ 前端 UI：

- 管理后台界面列出所有 `MineApplication`
- 【通过】按钮 → 审核通过

---

## ③ 项目方签署 & 创建池子（sign）

### 🧑 项目方操作：

```ts
await program.methods.signMine(mineCode).accounts({
  application: mineAppPDA,
  owner: wallet.publicKey,
  launchPool: launchPoolPDA,
  paymentVault: vaultPDA,
  paymentMint: usdcMint,
  tokenProgram: TOKEN_PROGRAM_ID,
  ...
}).signers([...]).rpc();
```

### ✅ 效果：

- 创建了 LaunchPool（PDA）
- 创建了 Vault（Program 持有的 TokenAccount）
- LaunchPool 记录价格、募集上限、收益率等

---

## ④ 投资者打款（stake）

### 🧑 投资者操作：

```ts
await program.methods.stake({
  amount: new BN(100_000_000), // 100 USDC
  stableCoin: "USDC",
  txnHash: "xxx",
}).accounts({
  pool: launchPoolPDA,
  staker: wallet.publicKey,
  userTokenAccount: userUSDCAccount,
  vault: poolVault,
  stakeRecord: stakeRecordPDA,
  ...
}).rpc();
```

### ✅ 钱打到哪里了？

- SPL Token 实际转账：用户 → 程序的 Vault
- Vault 是 `token::authority = LaunchPool` 创建的，受程序控制
- 钱被锁定在 vault 中，不能直接被项目方转走

---

## ⑤ 项目方提款（release）

### ✅ 条件：

- 当前时间 >= `LaunchPool.end_time`

### 🧑 项目方操作：

```ts
await program.methods.release().accounts({
  pool: launchPoolPDA,
  vault: vaultPDA,
  receiver: yourTokenAccount,
  ...
}).rpc();
```

→ 将募集金额从 Vault 打入项目方钱包

---

# 💡 钱是如何“真正打过去”的？

| 阶段 | 动作 | 钱流向 | 验证方式 |
|------|------|--------|----------|
| stake | `token::transfer(user → vault)` | 用户的钱打入 LaunchPool 的 Vault | Solana Explorer 查看 vault token balance |
| release | `token::transfer(vault → receiver)` | 程序把钱发给项目方 | 仅允许 owner 调用 |

---

## 🧩 PDA Mapping 示例（JS）

```ts
const [mineAppPDA] = findProgramAddressSync([Buffer.from("mine_app"), Buffer.from(mineCode)], programId);
const [launchPoolPDA] = findProgramAddressSync([Buffer.from("launch_pool"), Buffer.from(mineCode)], programId);
const [stakeRecordPDA] = findProgramAddressSync([Buffer.from("stake_record"), Buffer.from(mineCode), user.toBuffer()], programId);
```

---

## ✅ 总结：前端如何做打款

1. 用户调用 `stake(...)`
2. 后端/合约内部执行 `token::transfer`
3. 钱被锁在 vault（属于程序）
4. 项目方提取要等到 `release()` 阶段，才可以从 vault 提款
