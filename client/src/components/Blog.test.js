import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, fireEvent } from "@testing-library/react"
import Blog from "./Blog"

describe("Blog Tests", () => {
  const updateBlog = jest.fn()

  let component
  const blog = {
    id: "testId",
    title: "Component testing is done with react-testing-library",
    likes: 0,
    author: "Test",
    user: {
      id: "4567987987",
    },
  }

  beforeEach(() => {
    component = render(
      <Blog key={blog.id} blog={blog} updateBlog={updateBlog} />
    )
  })

  test("renders content", () => {
    const hidden = component.container.querySelector(".revealContent")
    const defaultContent = component.container.querySelector(".defaultContent")

    expect(defaultContent).toBeInTheDocument()
    expect(component.container.querySelector(".title")).toHaveTextContent(
      "Component testing is done with react-testing-library"
    )

    expect(component.container.querySelector(".author")).toHaveTextContent(
      "Test"
    )

    expect(hidden).not.toBeInTheDocument()
    expect(component.container.querySelector(".url")).not.toBeInTheDocument()
    expect(component.container.querySelector(".likes")).not.toBeInTheDocument()
  })

  test("reveals hidden content when button is clicked", () => {
    const viewButton = component.container.querySelector(".view")
    fireEvent.click(viewButton)

    expect(component.container.querySelector(".url")).toBeInTheDocument()
    expect(component.container.querySelector(".likes")).toBeInTheDocument()
  })

  test("like button clicked twice correctly receives event handler twice", () => {
    const viewButton = component.container.querySelector(".view")
    fireEvent.click(viewButton)

    const likeButton = component.container.querySelector(".likeButton")
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})
