---
title: Lorem Ipsum
description: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
---

# Documentation Features

This page showcases the different elements that can be added to a documentation page.

## Admonitions

!!! note
    There can even be customized admonitions!

!!! warning
    Make sure to properly store and manage your private keys.

??? code

    ```js
    // This is a comment

    import { readFileSync } from 'fs';

    const PI = 3.14159;

    class Circle {
      constructor(radius) {
        if (radius <= 0) {
          throw new Error("Radius must be positive");
        }
        this.radius = radius;
      }

      area() {
        return PI * (this.radius ** 2);
      }
    }
    ```

!!! interface 
    - **Title**: Description.
    - **Title**: Description.
    - **Title**: Description.

??? interface
    - **Title**: Description.
    - **Title**: Description.
    - **Title**: Description.

## Tables

| Parameter      | Value                 |
| -------------- | --------------------- |
| Lorem ipsum    | `dolor sit amet`      |
| consectetur    | `adipiscing elit`     |
| sed do eiusmod | `tempor incididunt`   |
| ut labore et   | `dolore magna aliqua` |

## Tabs

=== "HTTP"

    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.

    - Item one
    - Item two
    - Item three
    
=== "WSS"

    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.

    | Parameter      | Value                 |
    | -------------- | --------------------- |
    | Lorem ipsum    | `dolor sit amet`      |
    | consectetur    | `adipiscing elit`     |
    | sed do eiusmod | `tempor incididunt`   |
    | ut labore et   | `dolore magna aliqua` |

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.

## Terminal

<div id="termynal" data-termynal>
  <span data-ty="input"><span class="file-path"></span>npx hardhat init</span>
  <span data-ty>888&nbsp;&nbsp;&nbsp;&nbsp;888&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;888&nbsp;888&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;888</span>
  <span data-ty>888&nbsp;&nbsp;&nbsp;&nbsp;888&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;888&nbsp;888&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;888</span>
  <span data-ty>888&nbsp;&nbsp;&nbsp;&nbsp;888&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;888&nbsp;888&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;888</span>
  <span data-ty>8888888888&nbsp;&nbsp;8888b.&nbsp;&nbsp;888d888&nbsp;.d88888&nbsp;88888b.&nbsp;&nbsp;&nbsp;8888b.&nbsp;&nbsp;888888</span>
  <span data-ty>888&nbsp;&nbsp;&nbsp;&nbsp;888&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"88b&nbsp;888P"&nbsp;&nbsp;d88"&nbsp;888&nbsp;888&nbsp;"88b&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"88b&nbsp;888</span>
  <span data-ty>888&nbsp;&nbsp;&nbsp;&nbsp;888&nbsp;.d888888&nbsp;888&nbsp;&nbsp;&nbsp;&nbsp;888&nbsp;&nbsp;888&nbsp;888&nbsp;&nbsp;888&nbsp;.d888888&nbsp;888</span>
  <span data-ty>888&nbsp;&nbsp;&nbsp;&nbsp;888&nbsp;888&nbsp;&nbsp;888&nbsp;888&nbsp;&nbsp;&nbsp;&nbsp;Y88b&nbsp;888&nbsp;888&nbsp;&nbsp;888&nbsp;888&nbsp;&nbsp;888&nbsp;Y88b.</span>
  <span data-ty>888&nbsp;&nbsp;&nbsp;&nbsp;888&nbsp;"Y888888&nbsp;888&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Y88888&nbsp;888&nbsp;&nbsp;888&nbsp;"Y888888&nbsp;&nbsp;"Y888</span>
    <br>
  <span data-ty>👷 Welcome to Hardhat v2.22.2 👷‍</span>
    <br>
  <span data-ty="input" data-ty-prompt="?">&nbsp;What do you want to do? …</span>
  <span data-ty>&nbsp;&nbsp;Create a JavaScript project </span>
  <span data-ty>&nbsp;&nbsp;Create a TypeScript project </span>
  <span data-ty>&nbsp;&nbsp;Create a TypeScript project (with Viem) </span>
  <span data-ty="input" data-ty-prompt="❯ Create an empty hardhat.config.js"></span>
  <span data-ty>&nbsp;&nbsp;Quit </span>
</div>

## Code Blocks

=== "JavaScript"

    ```js
    // This is a comment

    import { readFileSync } from 'fs';

    const PI = 3.14159;

    class Circle {
      constructor(radius) {
        if (radius <= 0) {
          throw new Error("Radius must be positive");
        }
        this.radius = radius;
      }

      area() {
        return PI * (this.radius ** 2);
      }
    }
    ```

=== "JSON"

    ```json
    {
        "name": "DataHaven",
        "version": "1.0.0",
        "secure": true,
        "maxConnections": 100,
        "nodes": [
            { "id": 1, "status": "active" },
            { "id": 2, "status": "inactive" }
        ],
        "metadata": null
    }
    ```

=== "Python"

    ```py
    # This is a comment

    import math

    class Circle:
        def __init__(self, radius: float):
            if radius <= 0:
                raise ValueError("Radius must be positive")
            self.radius = radius

        def area(self) -> float:
            return math.pi * (self.radius ** 2)

    # Usage
    c = Circle(5)
    print(f"Circle area: {c.area()}")
    ```

=== "Solidity"

    ```solidity
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.20;

    interface IExample {
        error Unauthorized(address caller);
        function setValue(uint256 newValue) external;
    }

    contract Example is IExample {
        address public owner;
        uint256 private value;

        constructor() {
            owner = msg.sender;
        }

        function setValue(uint256 newValue) external override {
            if (msg.sender != owner) revert Unauthorized(msg.sender);
            value = newValue;
        }
    }
    ```

=== "YAML"

    ```yaml
    name: DataHaven
    version: "1.0.0"
    secure: true
    maxConnections: 100

    nodes:
    - id: 1
        status: active
    - id: 2
        status: inactive

    metadata: null
    ```

## Cards

<div class="grid cards" markdown>

-   :octicons-tools-16:{ .lg .middle } **Lorem Ipsum**

    ---

    Lorem Ipsum is simply dummy text of the printing and typesetting industry.

    :octicons-arrow-right-16: [Get Started](/manage-data/quickstart/)

-   :octicons-tools-16:{ .lg .middle } **Lorem Ipsum**

    ---

    Lorem Ipsum is simply dummy text of the printing and typesetting industry.

    :octicons-arrow-right-16: [Get Started](/manage-data/quickstart/)

-   :octicons-tools-16:{ .lg .middle } **Lorem Ipsum**

    ---

    Lorem Ipsum is simply dummy text of the printing and typesetting industry.

    :octicons-arrow-right-16: [Get Started](/manage-data/quickstart/)

</div>

## Lists

Unordered:

- Lorem ipsum dolor sit amet, consectetur adipiscing elit.
- Proin ac nisi a purus euismod aliquet vel a purus.
- Nullam sed lacus pulvinar, sollicitudin odio a, rhoncus nulla.
- Sed convallis dolor eleifend tristique dictum.
- Sed scelerisque metus vitae eleifend tincidunt.

Ordered:

1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
2. Proin ac nisi a purus euismod aliquet vel a purus.
3. Nullam sed lacus pulvinar, sollicitudin odio a, rhoncus nulla.
4. Sed convallis dolor eleifend tristique dictum.
5. Sed scelerisque metus vitae eleifend tincidunt.

