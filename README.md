# 3D RL-Based Traffic Signal Simulation Prioritizing Ambulances

An interactive traffic control simulation built with Next.js, TypeScript, and React Three Fiber. The project models a smart junction that adapts signal phases, tracks traffic flow, and prioritizes ambulances through RL-style decision logic.

Developed by Keerthishree Kesavan.

## Preview

![Project Demo](demo.gif)

## Overview

This project simulates an adaptive traffic signal system with:

- live 3D intersection rendering
- ambulance-priority signal behavior
- RL-inspired state, action, and reward logic
- real-time traffic metrics
- a dashboard for reward, waiting, collision, and throughput trends

## Features

- 3D traffic junction visualization using React Three Fiber
- dynamic traffic signal switching between north-south and east-west phases
- emergency vehicle prioritization
- queue handling with spacing and lane-change behavior
- dashboard charts powered by Recharts
- responsive simulator controls and live HUD

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Three Fiber
- Recharts
- Zustand

## Local Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Project Structure

```plaintext
app/
  traffic/
    dashboard/
components/
  traffic/
lib/
public/
```

## Simulator Highlights

- north-south and east-west phase switching
- ambulance-aware priority decisions
- reward and penalty tracking
- queue waiting and throughput monitoring
- collision and near-miss awareness

## Dashboard Highlights

- average reward snapshot
- throughput, collision, and wait metrics
- reward-over-time chart
- additional charts for collisions, total wait, and throughput

## License

This project includes an MIT license in the `LICENSE` file.
