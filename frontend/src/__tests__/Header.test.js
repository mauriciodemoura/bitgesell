import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import Header from "../pages/Header";
import { MemoryRouter } from "react-router-dom";

jest.mock("../services/StatsService/StatsService", () => ({
  getStats: () => Promise.resolve({ total: 123, averagePrice: 45.67 }),
}));

describe("Header", () => {
  test("renders title and stats", async () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText(/item explorer/i)).toBeInTheDocument();

    expect(await screen.findByText(/123/i)).toBeInTheDocument();
    expect(await screen.findByText(/\$45\.67/)).toBeInTheDocument();
  });
});
