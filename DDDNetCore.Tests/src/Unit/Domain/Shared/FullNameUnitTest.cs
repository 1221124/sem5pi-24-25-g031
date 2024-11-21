using Xunit;
using System;
using Domain.Shared;

namespace DDDNetCore.Tests.Unit.Domain.Shared;

public class FullNameUnitTest
{
    // Teste para criação de FullName com valores válidos
    [Fact]
    public void FullName_ShouldBeCreated_WithValidFirstAndLastName()
    {
        // Arrange
        var firstName = new Name("John");
        var lastName = new Name("Doe");

        // Act
        var fullName = new FullName(firstName, lastName);

        // Assert
        Assert.NotNull(fullName);
        Assert.Equal("John", fullName.FirstName.Value);
        Assert.Equal("Doe", fullName.LastName.Value);
    }

    // Teste para garantir que dois objetos FullName com os mesmos valores são iguais
    [Fact]
    public void FullName_ShouldBeEqual_WhenFirstAndLastNamesAreSame()
    {
        // Arrange
        var firstName = new Name("John");
        var lastName = new Name("Doe");

        var fullName1 = new FullName(firstName, lastName);
        var fullName2 = new FullName(firstName, lastName);

        // Act & Assert
        Assert.Equal(fullName1, fullName2);
        Assert.True(fullName1.Equals(fullName2));
    }

    // Teste para garantir que dois objetos FullName com valores diferentes não são iguais
    [Fact]
    public void FullName_ShouldNotBeEqual_WhenFirstOrLastNamesAreDifferent()
    {
        // Arrange
        var fullName1 = new FullName(new Name("John"), new Name("Doe"));
        var fullName2 = new FullName(new Name("Jane"), new Name("Doe"));

        // Act & Assert
        Assert.NotEqual(fullName1, fullName2);
        Assert.False(fullName1.Equals(fullName2));
    }

    // Teste para garantir que a conversão implícita para string retorna o nome completo
    [Fact]
    public void FullName_ShouldReturnFullNameString_WhenConvertedToString()
    {
        // Arrange
        var fullName = new FullName(new Name("John"), new Name("Doe"));

        // Act
        string stringValue = fullName;

        // Assert
        Assert.Equal("John Doe", stringValue);
    }

    // Teste para garantir que o método ToString retorna o nome completo corretamente
    [Fact]
    public void FullName_ShouldReturnCorrectString_WhenToStringIsCalled()
    {
        // Arrange
        var fullName = new FullName(new Name("John"), new Name("Doe"));

        // Act
        var result = fullName.ToString();

        // Assert
        Assert.Equal("John Doe", result);
    }

    // Teste para garantir que o hash code é igual para objetos com os mesmos valores
    [Fact]
    public void FullName_ShouldReturnSameHashCode_WhenValuesAreSame()
    {
        // Arrange
        var firstName = new Name("John");
        var lastName = new Name("Doe");

        var fullName1 = new FullName(firstName, lastName);
        var fullName2 = new FullName(firstName, lastName);

        // Act & Assert
        Assert.Equal(fullName1.GetHashCode(), fullName2.GetHashCode());
    }

    // Teste para garantir que o hash code é diferente para objetos com valores diferentes
    [Fact]
    public void FullName_ShouldReturnDifferentHashCode_WhenValuesAreDifferent()
    {
        // Arrange
        var fullName1 = new FullName(new Name("John"), new Name("Doe"));
        var fullName2 = new FullName(new Name("Jane"), new Name("Doe"));

        // Act & Assert
        Assert.NotEqual(fullName1.GetHashCode(), fullName2.GetHashCode());
    }
}