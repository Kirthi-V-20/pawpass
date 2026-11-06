CREATE TABLE pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    owner_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100),

    gender VARCHAR(20) NOT NULL
        CHECK (gender IN ('Male', 'Female')),

    date_of_birth DATE,

    color VARCHAR(100),
    weight NUMERIC(6, 2)
        CHECK (weight IS NULL OR weight >= 0),

    notes TEXT,
    photo_url TEXT,

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'LOST', 'FOUND')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pets_owner_id ON pets(owner_id);