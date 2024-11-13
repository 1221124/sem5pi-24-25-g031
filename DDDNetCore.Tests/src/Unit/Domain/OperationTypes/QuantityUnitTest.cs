using Xunit;
using Domain.OperationTypes;
using Domain.Shared;
using System;

namespace DDDNetCore.Tests.src.Unit.Domain.OperationTypes
{
    public class QuantityUnitTest
    {
        [Fact]
        public void Constructor_ShouldInitializeWithProvidedValue()
        {
            // Arrange
            int value = 10;

            // Act
            var quantity = new Quantity(value);

            // Assert
            Assert.Equal(value, quantity.Value);
        }

        [Fact]
        public void Constructor_ShouldThrowException_WhenValueIsNegative()
        {
            // Arrange
            int negativeValue = -5;

            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => new Quantity(negativeValue));
        }

        [Fact]
        public void ImplicitOperatorQuantityFromInt_ShouldReturnQuantity_WhenValueIsNonNegative()
        {
            // Arrange
            int value = 15;

            // Act
            Quantity quantity = value;

            // Assert
            Assert.Equal(value, quantity.Value);
        }

        [Fact]
        public void ImplicitOperatorQuantityFromInt_ShouldThrowException_WhenValueIsNegative()
        {
            // Arrange
            int negativeValue = -10;

            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => { Quantity _ = negativeValue; });
        }

        [Fact]
        public void ImplicitOperatorQuantityFromString_ShouldReturnQuantity_WhenStringIsValidNonNegativeInteger()
        {
            // Arrange
            string value = "20";

            // Act
            Quantity quantity = value;

            // Assert
            Assert.Equal(20, quantity.Value);
        }

        [Fact]
        public void ImplicitOperatorQuantityFromString_ShouldThrowException_WhenStringIsInvalid()
        {
            // Arrange
            string invalidString = "invalid";

            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => { Quantity _ = invalidString; });
        }

        [Fact]
        public void ImplicitOperatorQuantityFromString_ShouldThrowException_WhenStringIsNegativeInteger()
        {
            // Arrange
            string negativeString = "-5";

            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => { Quantity _ = negativeString; });
        }

        [Fact]
        public void ImplicitOperatorStringFromQuantity_ShouldReturnStringValue()
        {
            // Arrange
            var quantity = new Quantity(25);

            // Act
            string result = quantity;

            // Assert
            Assert.Equal("25", result);
        }

        [Fact]
        public void ImplicitOperatorIntFromQuantity_ShouldReturnIntValue()
        {
            // Arrange
            var quantity = new Quantity(30);

            // Act
            int result = quantity;

            // Assert
            Assert.Equal(30, result);
        }
    }
}
