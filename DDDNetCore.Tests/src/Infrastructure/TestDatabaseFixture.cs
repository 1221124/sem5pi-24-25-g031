using Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;

namespace DDDNetCore.Tests.Infrastructure
{
    public class TestDatabaseFixture : IDisposable
    {
        public TestDbContext Context { get; set; }

        public TestDatabaseFixture()
        {
            var options = new DbContextOptionsBuilder<TestDbContext>()
                .UseInMemoryDatabase("TestDatabase")
                .ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>()
                .Options;

            Context = new TestDbContext(options);

        }

        public void Dispose()
        {
            Context.Database.EnsureDeleted();
            Context.Dispose();
        }
    }
}
