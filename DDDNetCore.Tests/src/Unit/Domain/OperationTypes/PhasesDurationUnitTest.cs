using Xunit;
using System;
using System.Collections.Generic;
using Domain.OperationTypes;
using Domain.Shared;

namespace DDDNetCore.Tests.src.Unit.Domain.OperationTypes
{
    public class PhasesDurationUnitTest
    {
        [Fact]
        public void Constructor_ShouldInitializeWithDefaultValues_WhenNoArguments()
        {
            // Act
            var phasesDuration = new PhasesDuration();

            // Assert
            Assert.Equal(0, phasesDuration.Preparation.Value);
            Assert.Equal(0, phasesDuration.Surgery.Value);
            Assert.Equal(0, phasesDuration.Cleaning.Value);
        }

        [Fact]
        public void Constructor_ShouldInitializeWithProvidedValues()
        {
            // Arrange
            var preparation = new Quantity(30);
            var surgery = new Quantity(120);
            var cleaning = new Quantity(20);

            // Act
            var phasesDuration = new PhasesDuration(preparation, surgery, cleaning);

            // Assert
            Assert.Equal(30, phasesDuration.Preparation.Value);
            Assert.Equal(120, phasesDuration.Surgery.Value);
            Assert.Equal(20, phasesDuration.Cleaning.Value);
        }

        [Fact]
        public void Constructor_ShouldThrowException_WhenMissingRequiredPhase()
        {
            // Arrange
            var preparation = new Quantity(30);
            var surgery = new Quantity(120);

            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => new PhasesDuration(preparation, surgery, null));
        }

        [Fact]
        public void ImplicitOperatorString_ShouldReturnCorrectFormat()
        {
            // Arrange
            var phases = new PhasesDuration(new Quantity(30), new Quantity(120), new Quantity(20));

            // Act
            string result = phases;

            // Assert
            Assert.Equal("PREPARATION:30,SURGERY:120,CLEANING:20", result);
        }

        [Fact]
        public void ImplicitOperatorPhasesDuration_ShouldParseFromValidString()
        {
            // Arrange
            var phasesString = "PREPARATION:30,SURGERY:120,CLEANING:20";

            // Act
            PhasesDuration phasesDuration = phasesString;

            // Assert
            Assert.Equal(30, phasesDuration.Preparation.Value);
            Assert.Equal(120, phasesDuration.Surgery.Value);
            Assert.Equal(20, phasesDuration.Cleaning.Value);
        }

        [Fact]
        public void ImplicitOperatorPhasesDuration_ShouldThrowException_WhenInvalidStringFormat()
        {
            // Arrange
            var invalidString = "PREPARATION30,SURGERY120,CLEANING20";

            // Act & Assert
            Assert.Throws<ArgumentException>(() => { PhasesDuration _ = invalidString; });
        }

        [Fact]
        public void FromStringList_ShouldReturnPhasesDuration_WhenValidListProvided()
        {
            // Arrange
            var phasesList = new List<string> { "PREPARATION:30", "SURGERY:120", "CLEANING:20" };

            // Act
            var phasesDuration = PhasesDuration.FromString(phasesList);

            // Assert
            Assert.Equal(30, phasesDuration.Preparation.Value);
            Assert.Equal(120, phasesDuration.Surgery.Value);
            Assert.Equal(20, phasesDuration.Cleaning.Value);
        }

        [Fact]
        public void FromStringList_ShouldThrowException_WhenMissingPhase()
        {
            // Arrange
            var phasesList = new List<string> { "PREPARATION:30", "SURGERY:120" };

            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => PhasesDuration.FromString(phasesList));
        }
    }
}