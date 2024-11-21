using System;
using Domain.Shared;
using Xunit;

namespace DDDNetCore.Tests.Unit.Domain.Shared;

public class ContactInformationUnitTest
{
    [Fact]
    public void ContactInformation_ShouldBeCreated_WithValidData()
    {
        var email = new Email("john.doe@example.com");
        var phoneNumber = new PhoneNumber("123456789");

        var contactInfo = new ContactInformation(email, phoneNumber);

        Assert.NotNull(contactInfo);
        Assert.Equal("john.doe@example.com", contactInfo.Email.Value);
        Assert.Equal("123456789", contactInfo.PhoneNumber);
    }

    // Teste para garantir que o valor do email e do telefone não são nulos.
    [Fact]
    public void ContactInformation_ShouldThrowException_WhenEmailIsNull()
    {
        var phoneNumber = new PhoneNumber("123456789");

        Assert.Throws<ArgumentNullException>(() => new ContactInformation(null, phoneNumber));
    }

    [Fact]
    public void ContactInformation_ShouldThrowException_WhenPhoneNumberIsNull()
    {
        var email = new Email("john.doe@example.com");

        Assert.Throws<ArgumentNullException>(() => new ContactInformation(email, null));
    }

    // Teste para garantir que a comparação de ContactInformation com os mesmos valores sejam igual.
    [Fact]
    public void ContactInformation_ShouldBeEqual_WhenSameEmailAndPhoneNumber()
    {
        // Arrange
        var email = new Email("john.doe@example.com");
        var phoneNumber = new PhoneNumber("123456789");

        var contactInfo1 = new ContactInformation(email, phoneNumber);
        var contactInfo2 = new ContactInformation(email, phoneNumber);

        // Act & Assert
        Assert.Equal(contactInfo1, contactInfo2);
    }

    // Teste para garantir que ContactInformation com diferentes valores não sejam iguais.
    [Fact]
    public void ContactInformation_ShouldNotBeEqual_WhenDifferentEmail()
    {
        // Arrange
        var email1 = new Email("john.doe@example.com");
        var email2 = new Email("jane.doe@example.com");
        var phoneNumber = new PhoneNumber("123456789");

        var contactInfo1 = new ContactInformation(email1, phoneNumber);
        var contactInfo2 = new ContactInformation(email2, phoneNumber);

        // Act & Assert
        Assert.NotEqual(contactInfo1, contactInfo2);
    }

    [Fact]
    public void ContactInformation_ShouldNotBeEqual_WhenDifferentPhoneNumber()
    {
        // Arrange
        var email = new Email("john.doe@example.com");
        var phoneNumber1 = new PhoneNumber("123456789");
        var phoneNumber2 = new PhoneNumber("987654321");

        var contactInfo1 = new ContactInformation(email, phoneNumber1);
        var contactInfo2 = new ContactInformation(email, phoneNumber2);

        // Act & Assert
        Assert.NotEqual(contactInfo1, contactInfo2);
    }

    // Teste para garantir que o método GetHashCode gera o mesmo valor para os mesmos objetos.
    [Fact]
    public void ContactInformation_ShouldReturnSameHashCode_WhenSameValues()
    {
        // Arrange
        var email = new Email("john.doe@example.com");
        var phoneNumber = new PhoneNumber("123456789");

        var contactInfo1 = new ContactInformation(email, phoneNumber);
        var contactInfo2 = new ContactInformation(email, phoneNumber);

        // Act & Assert
        Assert.Equal(contactInfo1.GetHashCode(), contactInfo2.GetHashCode());
    }

    // Teste para garantir que o método GetHashCode gera valores diferentes para objetos diferentes.
    [Fact]
    public void ContactInformation_ShouldReturnDifferentHashCode_WhenDifferentValues()
    {
        // Arrange
        var email1 = new Email("john.doe@example.com");
        var email2 = new Email("jane.doe@example.com");
        var phoneNumber = new PhoneNumber("123456789");

        var contactInfo1 = new ContactInformation(email1, phoneNumber);
        var contactInfo2 = new ContactInformation(email2, phoneNumber);

        Assert.NotEqual(contactInfo1.GetHashCode(), contactInfo2.GetHashCode());
    }
}