# Use the official .NET SDK image for .NET 9
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# Set the working directory
WORKDIR /app

# Copy the .csproj file and restore dependencies
COPY ["DDDNetCore.csproj", "./"]
RUN dotnet restore "DDDNetCore.csproj"

# Copy the rest of the application code
COPY . .

# Build the application
RUN dotnet publish "DDDNetCore.csproj" -c Release -o /app/publish

# Use the official .NET runtime image for .NET 9 to run the application
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime

# Set the working directory to /app
WORKDIR /app

# Copy the published application from the build image
COPY --from=build /app/publish .

# Expose port 80
EXPOSE 80

# Set the entrypoint to run the application
ENTRYPOINT ["dotnet", "DDDNetCore.dll"]