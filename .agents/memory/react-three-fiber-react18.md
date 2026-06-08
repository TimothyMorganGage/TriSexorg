---
name: react-three-fiber on React 18
description: Version pinning needed to add three.js/react-three-fiber to this React 18 project
---

# react-three-fiber on React 18

This project is React 18.3.1. The latest `@react-three/fiber@9.x` declares a peer of
`react@">=19 <19.3"`, so a bare `@react-three/fiber` install fails with ERESOLVE.

**Rule:** pin the React-18-compatible line — `@react-three/fiber@^8.17.10` +
`@react-three/drei@^9.x` + `three@^0.169.0` (+ `@types/three`).

**Why:** fiber 9 dropped React 18 support; drei 9 still targets fiber 8 / React 18.

**How to apply:** any new 3D/canvas work here must install the 8.x fiber line until the
app upgrades to React 19. The viewer chunk is heavy (~840KB) so lazy-load it.
