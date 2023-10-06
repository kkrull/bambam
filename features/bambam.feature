Feature: Convert EZDrummer 2 track to General MIDI
  As a musician
  I want to convert EZDrummer 2 tracks back and forth with General MIDI
  So that I can maintain flow when copying drum tracks to MuseScore

#TODO KDK: Should other events be included, like Key Signature, Marker, Set Tempo, Time Signature?
#TODO KDK: Include End of Track event, which is not optional
  Scenario: BamBam should convert an EZDrummer 2 track to General MIDI
    Given I have exported an EZDrummer 2 track from my DAW, as MIDI
    When I ask BamBam to remap that track to General MIDI Percussion
    Then BamBam should create a track that plays back at the same tempo
    And the General MIDI track should play the same drum pattern as the original
    And non-standard notes should be changed to their equivalent in General MIDI
