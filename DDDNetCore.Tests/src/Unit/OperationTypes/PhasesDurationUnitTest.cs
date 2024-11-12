using Xunit;
using System;
using System.Collections.Generic;
using Domain.OperationTypes;
using Domain.Shared;

namespace Tests.Domain.OperationTypes
{
    public class PhasesDurationUnitTest
    {
        [Fact]
        public void Constructor_ShouldInitializeWithDefaultValues_WhenNoArguments()
        {
            // Act
            var phasesDuration = new PhasesDuration();

            // Assert
            Assert.Equal(0, phasesDuration.Phases[Phase.Preparation].Value);
            Assert.Equal(0, phasesDuration.Phases[Phase.Surgery].Value);
            Assert.Equal(0, phasesDuration.Phases[Phase.Cleaning].Value);
        }

        [Fact]
        public void Constructor_ShouldInitializeWithProvidedValues()
        {
            // Arrange
            var phases = new Dictionary<Phase, Quantity>
            {
                { Phase.Preparation, new Quantity(30) },
                { Phase.Surgery, new Quantity(120) },
                { Phase.Cleaning, new Quantity(20) }
            };

            // Act
            var phasesDuration = new PhasesDuration(phases);

            // Assert
            Assert.Equal(30, phasesDuration.Phases[Phase.Preparation].Value);
            Assert.Equal(120, phasesDuration.Phases[Phase.Surgery].Value);
            Assert.Equal(20, phasesDuration.Phases[Phase.Cleaning].Value);
        }

        [Fact]
        public void Constructor_ShouldThrowException_WhenMissingRequiredPhase()
        {
            // Arrange
            var phases = new Dictionary<Phase, Quantity>
            {
                { Phase.Preparation, new Quantity(30) },
                { Phase.Surgery, new Quantity(120) }
                // Missing Cleaning
            };

            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => new PhasesDuration(phases));
        }

        [Fact]
        public void ImplicitOperatorString_ShouldReturnCorrectFormat()
        {
            // Arrange
            var phases = new Dictionary<Phase, Quantity>
            {
                { Phase.Preparation, new Quantity(30) },
                { Phase.Surgery, new Quantity(120) },
                { Phase.Cleaning, new Quantity(20) }
            };
            var phasesDuration = new PhasesDuration(phases);

            // Act
            string result = phasesDuration;

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
            Assert.Equal(30, phasesDuration.Phases[Phase.Preparation].Value);
            Assert.Equal(120, phasesDuration.Phases[Phase.Surgery].Value);
            Assert.Equal(20, phasesDuration.Phases[Phase.Cleaning].Value);
        }

        [Fact]
        public void ImplicitOperatorPhasesDuration_ShouldThrowException_WhenInvalidStringFormat()
        {
            // Arrange
            var invalidString = "INVALID_PHASE:30,SURGERY:120,CLEANING:20";

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
            Assert.Equal(30, phasesDuration.Phases[Phase.Preparation].Value);
            Assert.Equal(120, phasesDuration.Phases[Phase.Surgery].Value);
            Assert.Equal(20, phasesDuration.Phases[Phase.Cleaning].Value);
        }

        [Fact]
        public void FromStringList_ShouldThrowException_WhenInvalidPhaseInList()
        {
            // Arrange
            var phasesList = new List<string> { "INVALID_PHASE:30", "SURGERY:120", "CLEANING:20" };

            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => PhasesDuration.FromString(phasesList));
        }

        [Fact]
        public void FromStringList_ShouldThrowException_WhenMissingPhase()
        {
            // Arrange
            var phasesList = new List<string> { "PREPARATION:30", "SURGERY:120" }; // Missing Cleaning

            // Act & Assert
            Assert.Throws<BusinessRuleValidationException>(() => PhasesDuration.FromString(phasesList));
        }
    }

    public class PhaseUtilsTests
    {
        [Theory]
        [InlineData("PREPARATION", Phase.Preparation)]
        [InlineData("SURGERY", Phase.Surgery)]
        [InlineData("CLEANING", Phase.Cleaning)]
        public void FromString_ShouldReturnCorrectPhase_WhenValidString(string phaseString, Phase expectedPhase)
        {
            // Act
            var phase = PhaseUtils.FromString(phaseString);

            // Assert
            Assert.Equal(expectedPhase, phase);
        }

        [Fact]
        public void FromString_ShouldThrowException_WhenInvalidString()
        {
            // Arrange
            var invalidPhaseString = "INVALID_PHASE";

            // Act & Assert
            Assert.Throws<ArgumentException>(() => PhaseUtils.FromString(invalidPhaseString));
        }

        [Theory]
        [InlineData(Phase.Preparation, "PREPARATION")]
        [InlineData(Phase.Surgery, "SURGERY")]
        [InlineData(Phase.Cleaning, "CLEANING")]
        public void ToString_ShouldReturnCorrectString_WhenValidPhase(Phase phase, string expectedString)
        {
            // Act
            var result = PhaseUtils.ToString(phase);

            // Assert
            Assert.Equal(expectedString, result);
        }
    }
}