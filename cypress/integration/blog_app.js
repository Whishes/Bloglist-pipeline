describe("Blog app", function () {
  const blog = {
    title: "Test Blog",
    author: "Test Author",
    url: "http://google.com",
  }

  beforeEach(function () {
    cy.request("POST", "http://localhost:5000/api/testing/reset")
    const user = {
      name: "Matti Luukkainen",
      username: "mluukkai",
      password: "salainen",
    }

    cy.request("POST", "http://localhost:5000/api/users/", user)
    cy.visit("http://localhost:5000")
  })

  it("Login form is shown", function () {
    cy.contains("login")
  })

  describe("Logging in", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("mluukkai")
      cy.get("#password").type("salainen")
      cy.contains("login").click()

      cy.get("#loginButton").should("contain", "login")
    })

    it("fails with wrong credentials", function () {
      cy.get("#username").type("mluukkai")
      cy.get("#password").type("wrong")
      cy.contains("login").click()

      cy.get("#loginButton").should("contain", "login")
    })
  })

  describe("When logged in", function () {
    beforeEach(function () {
      cy.request("POST", "http://localhost:5000/api/login", {
        username: "mluukkai",
        password: "salainen",
      }).then(({ body }) => {
        localStorage.setItem("loggedBlogappUser", JSON.stringify(body))
        cy.visit("http://localhost:5000")
      })
    })

    it("A blog can be created", function () {
      cy.contains("new blog").click()
      cy.get(".title").type(blog.title)
      cy.get(".author").type(blog.author)
      cy.get(".url").type(blog.url)
      cy.get("#submitButton").click()

      cy.wait(1000) // eslint-disable-line

      cy.request("GET", "http://localhost:5000/api/blogs/").as("blogs")
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

      cy.wait(1000) // eslint-disable-line

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

      //cy.wait(1000)
      //cy.visit("http://localhost/3003")
      cy.get("#viewContent").click()
      cy.get("#deleteButton").click()

      cy.wait(1000) // eslint-disable-line

      cy.request("GET", "http://localhost:5000/api/blogs/").as("blogs")
      cy.get("@blogs").should((response) => {
        expect(response.body).to.have.length(0)
      })
    })

    it("check order of blogs", function () {
      cy.createBlog({ ...blog, title: "test title 1", likes: 0 })
      //cy.wait(500)
      cy.createBlog({ ...blog, title: "test title 2", likes: 1 })
      //cy.wait(500)
      cy.createBlog({ ...blog, title: "test title 3", likes: 2 })
      //cy.wait(500)

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
