package pets

import (
	"net/http"

	"pawpass/backend/internal/middleware"
)

func (h *PetHandler) List(w http.ResponseWriter, r *http.Request) {
	ownerID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		writePetError(w, http.StatusUnauthorized, "UNAUTHORIZED")
		return
	}

	pets, err := h.Service.ListByOwner(r.Context(), ownerID)
	if err != nil {
		writeServiceError(w, err)
		return
	}

	response := make([]any, 0, len(pets))
	for i := range pets {
		response = append(response, petResponse(&pets[i]))
	}

	writeJSON(w, http.StatusOK, response)
}
