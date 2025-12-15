# Project: Store & Orders Management Demo

## One-line summary

A modern store and orders dashboard built with Next.js and React, designed as a realistic admin-style demo for my portfolio.

## Problem

I wanted a realistic project that goes beyond a simple "todo list" or static landing page.  
Most junior portfolios only show basic UIs that don't reflect real business workflows such as:

- listing and filtering orders
- viewing detailed information about a single order
- working with product data and availability

So I decided to build a **store + orders management demo** that looks and feels like a real internal tool.

## Solution

I implemented a small but practical demo inside my portfolio:

- A **Store/Orders section** that shows a list of orders (or products)
- A **Details page** for each order with all important information
- Clean, dashboard-style UI that could be used by a support or operations team

This demo lives inside my main Next.js portfolio so I can easily share it as part of my developer story.

## Tech stack

- **Next.js (App Router)** – routing, layouts, server/client components
- **React** – UI composition
- **TypeScript** – type safety
- **Tailwind CSS** – fast and consistent styling
- (Optional later: React Query / TanStack Query for data fetching and caching)

## Key features

- Orders list page with:
  - clear table-style layout
  - readable columns (customer, date, total amount, status, etc.)
- Order details page with:
  - full information about a single order
  - better visual hierarchy (titles, sections, spacing)
- Store section (products):
  - product cards with name, price, availability
  - layout that can scale to many items

## UX decisions

- I focused on **readability** and **hierarchy**:
  - enough spacing between rows and sections
  - using badges/colors to make order status easy to scan
- I tried to make the UI feel like a real internal dashboard,  
  not just a pretty landing page.

## What I learned

- How to structure a mini "admin panel" inside a portfolio project
- How to think about real workflows (list → details) instead of only static pages
- How small UI details (spacing, typography, status badges) make a big difference in perceived quality

## Next improvements (TODOs)

- Add filters and search for orders
- Connect to a real or mocked API instead of static data
- Add loading and empty states for better UX

## Why I added this demo to my portfolio

I added this demo to my portfolio to show that I can build more than simple static pages — I can design and implement a small store and its order workflow end-to-end inside a real Next.js application.

This project demonstrates that I can:

- structure routes and pages for a dashboard-style experience,
- model products and orders in a clear way,
- and design a clean UI that makes it easy to scan lists and inspect a single order in detail.

It also shows how I think about real user flows (list → filter/search → details), readability, and maintainable React/TypeScript code — the same skills I want to bring to my next team or client.

## Screenshots & captions

### 1. Demo Storefront

This store page helps users quickly discover relevant products without jumping between multiple pages.  
By showing name, price, and availability in a clean grid, it makes it easier to compare items and decide what to view or buy next.

### 2. Orders List

This page shows an overview of all orders in a clean, table-style layout.  
It helps users quickly scan key information such as customer, date, total amount, and status, instead of opening each order one by one.  
By making statuses easy to see at a glance, it becomes much faster to track what is new, in progress, or completed.

### 3. Order Details

This page focuses on a single order and brings all important information into one place.  
It solves the problem of jumping between different views to understand what was ordered, who the customer is, and what the current status is.  
By grouping related information into clear sections, it makes it easier for a support or operations person to understand the context and take the next action.
