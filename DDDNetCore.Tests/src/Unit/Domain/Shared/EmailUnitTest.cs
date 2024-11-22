using Xunit;
using System;
using Domain.Shared;

namespace DDDNetCore.Tests.Unit.Domain.Shared;

public class EmailUnitTest
{
    // Teste para garantir que o Email é criado corretamente
    [Fact]
    public void Email_ShouldBeCreated_WithValidValue()
    {
        // Arrange
        var validEmail = "john.doe@example.com";

        // Act
        var email = new Email(validEmail);

        // Assert
        Assert.NotNull(email);
        Assert.Equal(validEmail, email.Value);
    }
    
    // Teste para garantir que dois emails com o mesmo valor são iguais
    [Fact]
    public void Email_ShouldBeEqual_WhenValuesAreSame()
    {
        // Arrange
        var email1 = new Email("john.doe@example.com");
        var email2 = new Email("john.doe@example.com");

        // Act & Assert
        Assert.Equal(email1, email2);
        Assert.True(email1.Equals(email2));
    }
    
    // Teste para garantir que dois emails com valores diferentes não são iguais
    [Fact]
    public void Email_ShouldNotBeEqual_WhenValuesAreDifferent()
    {
        // Arrange
        var email1 = new Email("john.doe@example.com");
        var email2 = new Email("jane.doe@example.com");

        // Act & Assert
        Assert.NotEqual(email1, email2);
        Assert.False(email1.Equals(email2));
    }
    
    // Teste para verificar a conversão implícita de string para Email
    [Fact]
    public void Email_ShouldBeCreated_UsingImplicitConversionFromString()
    {
        // Arrange
        string validEmail = "john.doe@example.com";

        // Act
        Email email = validEmail;

        // Assert
        Assert.NotNull(email);
        Assert.Equal(validEmail, email.Value);
    }
    
    // Teste para verificar a conversão implícita de Email para string
    [Fact]
    public void Email_ShouldReturnStringValue_UsingImplicitConversionToString()
    {
        // Arrange
        var email = new Email("john.doe@example.com");

        // Act
        string stringValue = email;

        // Assert
        Assert.Equal("john.doe@example.com", stringValue);
    }
    
    // Teste para verificar o método ToString
    [Fact]
    public void Email_ShouldReturnCorrectString_WhenToStringIsCalled()
    {
        // Arrange
        var email = new Email("john.doe@example.com");

        // Act
        var result = email.ToString();

        // Assert
        Assert.Equal("john.doe@example.com", result);
    }
    
    // Teste para garantir que o hash code é igual para valores iguais
    [Fact]
    public void Email_ShouldReturnSameHashCode_WhenValuesAreSame()
    {
        // Arrange
        var email1 = new Email("john.doe@example.com");
        var email2 = new Email("john.doe@example.com");

        // Act & Assert
        Assert.Equal(email1.GetHashCode(), email2.GetHashCode());
    }

    // Teste para garantir que o hash code é diferente para valores diferentes
    [Fact]
    public void Email_ShouldReturnDifferentHashCode_WhenValuesAreDifferent()
    {
        // Arrange
        var email1 = new Email("john.doe@example.com");
        var email2 = new Email("jane.doe@example.com");

        // Act & Assert
        Assert.NotEqual(email1.GetHashCode(), email2.GetHashCode());
    }
}