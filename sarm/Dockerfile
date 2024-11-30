FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["sarm/DDDNetCore.csproj", "sarm/"]
RUN dotnet restore "sarm/DDDNetCore.csproj"

COPY . .
WORKDIR "/sarm/src"
RUN dotnet build "DDDNetCore.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "DDDNetCore.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DDDNetCore.dll"]