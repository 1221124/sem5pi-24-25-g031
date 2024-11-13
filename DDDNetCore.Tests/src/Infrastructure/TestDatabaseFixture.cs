using Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;

namespace DDDNetCore.Tests.src.Infrastructure
{
    public class TestDatabaseFixture : IDisposable
    {
        public TestDbContext Context { get; set; }

        public TestDatabaseFixture()
        {
            var options = new DbContextOptionsBuilder<TestDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>()
                .Options;

            Context = new TestDbContext(options);

        }

        public void Dispose()
        {
            Context.Database.EnsureDeleted();
            Context.Dispose();
        }

        public void Reset()
        {
            Context.Database.EnsureDeleted();
            Context.Database.EnsureCreated();
        }
    }
}
