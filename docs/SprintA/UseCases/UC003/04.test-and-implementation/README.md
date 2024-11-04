# UC003 - As a Patient, I want to register for the healthcare application, so that I can create a user profile and book appointments online

## 4. Tests

In this project, a Test-Driven Development (TDD) approach was used.

### 4.1. UserServiceTest

```csharp
using Moq;
using Xunit;

public class UserServiceTest {
    private UserService userService;
    private Mock<UserRepository> userRepositoryMock;

    public UserServiceTest() {
        userRepositoryMock = new Mock<UserRepository>();
        userService = new UserService(userRepositoryMock.Object);
    }

    [Fact]
    public void Register_User_Should_Save_User_When_Valid() {
        var user = new User { Username = "patient1@example.com", Email = "patient1@example.com" };

        userService.Register(user);

        userRepositoryMock.Verify(repo => repo.Save(It.Is<User>(u => u.Username == "patient1@example.com" && u.Email == "patient1@example.com")), Times.Once);
    }

    [Fact]
    public void Register_User_Should_Throw_Exception_When_Email_Exists() {
        var user = new User { Username = "patient1@example.com", Email = "patient1@example.com" };
        userRepositoryMock.Setup(repo => repo.ExistsByEmail(user.Email)).Returns(true);

        Assert.Throws<Exception>(() => userService.Register(user));
    }
}
