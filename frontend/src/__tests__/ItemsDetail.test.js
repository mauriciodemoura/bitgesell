import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import ItemDetail from "../pages/ItemDetail";
import { MemoryRouter, Route, Routes } from "react-router-dom";

jest.mock("../services/ItemsService/ItemsDetailService", () => ({
  getItemById: jest.fn(),
}));
import ItemDetailService from "../services/ItemsService/ItemsDetailService";

const mockItem = {
  name: "Test Product",
  category: "Electronics",
  price: 123.45
};

describe("ItemDetail", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders item detail when found", async () => {
    ItemDetailService.getItemById.mockResolvedValueOnce(mockItem);

    render(
      <MemoryRouter initialEntries={["/items/42"]}>
        <Routes>
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: /test product/i })).toBeInTheDocument();
    expect(screen.getByText(/category:/i)).toBeInTheDocument();
    expect(screen.getByText(/electronics/i)).toBeInTheDocument();
    expect(screen.getByText(/\$123\.45/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  test("shows not found message when service rejects", async () => {
    ItemDetailService.getItemById.mockRejectedValueOnce(new Error("not found"));

    render(
      <MemoryRouter initialEntries={["/items/99"]}>
        <Routes>
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/item not found/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });
});
