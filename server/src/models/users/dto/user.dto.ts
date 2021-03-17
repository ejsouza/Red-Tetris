/**
 * 	DTO
 * 	Data transfer objects (DTOs)
 * 	DTOs are objects that conform to data model types
 */

export interface UserDto {
	id: string;
	email: string;
	password: string;
	firstName?: string; // :? optional
	lastName?: string;
}

