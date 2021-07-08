describe("Blog app", function () {
  const blog = {
    title: "Test Blog",
    author: "Test Author",
    url: "http://google.com",
  }

  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset")
    const user = {
      name: "Matti Luukkainen",
      username: "mluukkai",
      password: "salainen",
    }

    cy.request("POST", "http://localhost:3003/api/users/", user)
    cy.visit("http://localhost:3000")
  })

  it("Login form is shown", function () {
    cy.contains("login")
  })

  describe("Logging in", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("mluukkai")
      cy.get("#password").type("salainen")
      cy.get("#loginButton").click()

      cy.contains("Matti Luukkainen logged in")
    })

    it("fails with wrong credentials", function () {
      cy.get("#username").type("mluukkai")
      cy.get("#password").type("wrong")
      cy.get("#loginButton").click()

      cy.get(".unsuccessful")
        .should("contain", "invalid username or password")
        .and("have.css", "color", "rgb(255, 0, 0)")
        .and("have.css", "border-style", "solid")

      cy.get("html").should("not.contain", "Matti Luukkainen logged in")
    })
  })

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "mluukkai", password: "salainen" })
    })

    it("A blog can be created", function () {
      cy.contains("new blog").click()
      cy.get(".title").type(blog.title)
      cy.get(".author").type(blog.author)
      cy.get(".url").type(blog.url)
      cy.get("#submitButton").click()

      cy.wait(1000)
      cy.request("GET", "http://localhost:3003/api/blogs/").as("blogs")
      cy.get("@blogs").should((response) => {
        expect(response.body[0]).to.have.property("title", "Test Blog")
        expect(response.body[0]).to.have.property("author", "Test Author")
        expect(response.body[0]).to.have.property("url", "http://google.com")
      })
    })

    it("A blog can be liked", function () {
      cy.contains("new blog").click()
      cy.get(".title").type(blog.title)
      cy.get(".author").type(blog.author)
      cy.get(".url").type(blog.url)
      cy.get("#submitButton").click()

      cy.wait(1000)

      cy.get("#viewContent").click()
      cy.get(".likeButton").click()
      cy.get(".blogLikes").should("contain", "1")
    })

    it("A blog can be deleted", function () {
      cy.contains("new blog").click()
      cy.get(".title").type(blog.title)
      cy.get(".author").type(blog.author)
      cy.get(".url").type(blog.url)
      cy.get("#submitButton").click()

      cy.wait(1000)
      cy.get("#viewContent").click()
      cy.get("#deleteButton").click()

      cy.wait(2000)
      cy.request("GET", "http://localhost:3003/api/blogs/").as("blogs")
      cy.get("@blogs").should((response) => {
        expect(response.body).to.have.length(0)
      })
    })

    it("check order of blogs", function () {
      cy.createBlog({ ...blog, title: "test title 1", likes: 0 })
      cy.wait(500)
      cy.createBlog({ ...blog, title: "test title 2", likes: 1 })
      cy.wait(500)
      cy.createBlog({ ...blog, title: "test title 3", likes: 2 })
      cy.wait(500)

      cy.get("#viewContent").click()
      cy.get("#viewContent").click()
      cy.get("#viewContent").click()

      cy.get(".blogLikes").then((response) => {
        console.log(response)
        expect(response).to.have.length(3)
        expect(response[0]).contain("2")
        expect(response[1]).contain("1")
        expect(response[2]).contain("0")
      })
    })
  })
})
