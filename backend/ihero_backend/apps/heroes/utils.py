from geopy.distance import distance


def calculate_distance(coords1, coords2):
    return distance(coords1, coords2).km


def convert_location(location):
    location = location.split(',')
    return (float(location[0]), float(location[1]))
