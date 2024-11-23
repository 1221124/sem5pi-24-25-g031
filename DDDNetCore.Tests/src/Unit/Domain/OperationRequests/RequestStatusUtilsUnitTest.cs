using System;
using DDDNetCore.Domain.OperationRequests;
using Xunit;

namespace DDDNetCore.Tests.Unit.Domain.OperationRequests
{
    public class RequestStatusUtilsUnitTests
    {
        [Fact]
        public void ToString_WithValidRequestStatus_ReturnsCorrectString()
        {
            // Act & Assert
            Assert.Equal("pending", RequestStatusUtils.ToString(RequestStatus.PENDING));
            Assert.Equal("accepted", RequestStatusUtils.ToString(RequestStatus.ACCEPTED));
            Assert.Equal("rejected", RequestStatusUtils.ToString(RequestStatus.REJECTED));
        }

        [Fact]
        public void ToString_WithInvalidRequestStatus_ReturnsEmptyString()
        {
            // Arrange
            RequestStatus invalidStatus = (RequestStatus)(-1);

            // Act
            var result = RequestStatusUtils.ToString(invalidStatus);

            // Assert
            Assert.Equal(string.Empty, result);
        }

        [Fact]
        public void FromString_WithValidString_ReturnsCorrectRequestStatus()
        {
            // Act & Assert
            Assert.Equal(RequestStatus.PENDING, RequestStatusUtils.FromString("pending"));
            Assert.Equal(RequestStatus.ACCEPTED, RequestStatusUtils.FromString("accepted"));
            Assert.Equal(RequestStatus.REJECTED, RequestStatusUtils.FromString("rejected"));
        }

        [Fact]
        public void FromString_WithInvalidString_ThrowsArgumentException()
        {
            // Arrange
            var invalidString = "invalid";

            // Act & Assert
            var ex = Assert.Throws<ArgumentException>(() => RequestStatusUtils.FromString(invalidString));
            Assert.Equal("Invalid request status value", ex.Message);
        }

        [Fact]
        public void Equals_WithSameRequestStatuses_ReturnsTrue()
        {
            // Act & Assert
            Assert.True(RequestStatusUtils.Equals(RequestStatus.PENDING, RequestStatus.PENDING));
            Assert.True(RequestStatusUtils.Equals(RequestStatus.ACCEPTED, RequestStatus.ACCEPTED));
            Assert.True(RequestStatusUtils.Equals(RequestStatus.REJECTED, RequestStatus.REJECTED));
        }

        [Fact]
        public void Equals_WithDifferentRequestStatuses_ReturnsFalse()
        {
            // Act & Assert
            Assert.False(RequestStatusUtils.Equals(RequestStatus.PENDING, RequestStatus.ACCEPTED));
            Assert.False(RequestStatusUtils.Equals(RequestStatus.ACCEPTED, RequestStatus.REJECTED));
            Assert.False(RequestStatusUtils.Equals(RequestStatus.REJECTED, RequestStatus.PENDING));
        }
    }
}