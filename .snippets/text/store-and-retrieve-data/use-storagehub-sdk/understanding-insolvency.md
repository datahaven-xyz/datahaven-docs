Insolvency in DataHaven is a two-phase process. When your account balance can no longer cover a provider's charge, that provider marks you as "out of funds." However, you are not yet globally insolvent. You become officially insolvent only when a provider attempts to charge you a second time, and you still cannot pay. This means the effective grace period before insolvency depends on how frequently providers charge and on the minimum they will charge.

Once you are flagged as globally insolvent:

- Providers that detect your insolvency will automatically stop storing your files and settle debts from your deposits.
- You cannot create new buckets or upload new files.
- You cannot create new storage requests until the flag is cleared and the cooldown period passes.

### Provider Auto-Cleanup vs Manual Recovery

During normal operation, providers will automatically detect that you've become insolvent, stop storing your files, and charge their owed debt from your deposits. When this happens, all your payment streams are cleaned up automatically, with no action on your part.

However, if a provider is offline or otherwise unable to process your insolvency (for example, if one of your providers went down and never detected your status change), the automatic cleanup won't fully complete. In this scenario, the `payOutstandingDebt` extrinsic acts as a failsafe, allowing you to manually release the locked funds from those unresolved payment streams and settle the debt yourself, rather than waiting indefinitely for an unreliable provider.

### Resolution Steps

To resolve insolvency, you must:

1. Pay your outstanding debt to providers (only needed if providers haven't already cleaned up your payment streams automatically).
2. Manually clear the insolvent flag.
3. Wait for the cooldown period of 100 blocks (~10 minutes) to pass before resuming normal operations.