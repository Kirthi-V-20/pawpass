import { NextRequest, NextResponse } from "next/server";

interface NominatimReverseResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const latitude = searchParams.get("lat");
  const longitude = searchParams.get("lon");

  if (!latitude || !longitude) {
    return NextResponse.json(
      {
        error: "Latitude and longitude are required",
      },
      {
        status: 400,
      },
    );
  }

  const latNumber = Number(latitude);
  const lonNumber = Number(longitude);

  if (
    !Number.isFinite(latNumber) ||
    !Number.isFinite(lonNumber)
  ) {
    return NextResponse.json(
      {
        error: "Invalid coordinates",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const url = new URL(
      "https://nominatim.openstreetmap.org/reverse",
    );

    url.searchParams.set("lat", String(latNumber));
    url.searchParams.set("lon", String(lonNumber));
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 8000);

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "User-Agent":
            "PawPass/1.0 location-picker",
          Accept: "application/json",
        },
        cache: "no-store",
        signal: controller.signal,
      });

      if (!response.ok) {
        console.error(
          "Nominatim reverse geocoding failed:",
          response.status,
        );

        return NextResponse.json(
          {
            error: "Reverse location search failed",
          },
          {
            status: 502,
          },
        );
      }

      const data =
        (await response.json()) as NominatimReverseResult;

      return NextResponse.json({
        latitude: latNumber,
        longitude: lonNumber,
        name: data.display_name ?? "",
        address: data.address ?? {},
      });
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      console.error(
        "Nominatim reverse geocoding timed out",
      );

      return NextResponse.json(
        {
          error: "Reverse location search timed out",
        },
        {
          status: 504,
        },
      );
    }

    console.error(
      "Reverse location failed:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to find location",
      },
      {
        status: 502,
      },
    );
  }
}