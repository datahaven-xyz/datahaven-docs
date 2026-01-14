---
title: Known Issues
description: This page lists the major known issues affecting DataHaven MSP and BSP nodes. It’s updated regularly as issues are identified or resolved.
---

# Known Issues

This page lists the major known issues affecting DataHaven MSP and BSP nodes. It’s updated regularly as issues are identified or resolved.

If you encounter a problem not listed here, please join the [DataHaven Discord](https://discord.com/invite/datahaven){target=\_blank} and use the Support Ticket chat to report it. This will create a private channel where our support team can respond directly.

## Deregistering a BSP Node is Currently Not Supported

After spinning up your own BSP node and verifying it on-chain, you will not be able to complete the deregistration flow if you wish to stop contributing to the network. This is due to a missing RPC method that is supposed to help you fill out the required parameters to execute the `bsp_request_stop_storing` extrinsic, which is a prerequisite for being able to execute the `bsp_sign_off` extrinsic, which signs off your BSP node.